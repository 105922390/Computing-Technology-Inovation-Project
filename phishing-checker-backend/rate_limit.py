from collections import OrderedDict, deque
from threading import Lock
import math
import time
from typing import Callable

from starlette.middleware.base import ASGIApp
from starlette.responses import JSONResponse


class RateLimiter:
    def __init__(
        self,
        max_requests: int,
        window_seconds: float,
        max_sources: int = 10_000,
        clock: Callable[[], float] = time.monotonic,
    ) -> None:
        if max_requests <= 0:
            raise ValueError("max_requests must be greater than zero")
        if window_seconds <= 0:
            raise ValueError("window_seconds must be greater than zero")
        if max_sources <= 0:
            raise ValueError("max_sources must be greater than zero")

        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.max_sources = max_sources
        self._clock = clock
        self._requests: OrderedDict[str, deque[float]] = OrderedDict()
        self._lock = Lock()

    def retry_after(self, source: str) -> int | None:
        now = self._clock()
        cutoff = now - self.window_seconds

        with self._lock:
            requests = self._requests.get(source)
            if requests is not None:
                while requests and requests[0] <= cutoff:
                    requests.popleft()
                if not requests:
                    del self._requests[source]
                    requests = None

            if requests is None:
                if len(self._requests) >= self.max_sources:
                    self._requests.popitem(last=False)
                requests = deque()
                self._requests[source] = requests
            else:
                self._requests.move_to_end(source)

            if len(requests) >= self.max_requests:
                return math.ceil(requests[0] + self.window_seconds - now)

            requests.append(now)
            return None


class RateLimitMiddleware:
    def __init__(
        self,
        app: ASGIApp,
        limiter: RateLimiter,
    ) -> None:
        self.app = app
        self.limiter = limiter

    async def __call__(self, scope, receive, send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        client = scope.get("client")
        source = client[0] if client else "unknown"
        retry_after = self.limiter.retry_after(source)

        if retry_after is not None:
            response = JSONResponse(
                status_code=503,
                content={"detail": "Too many requests. Please retry later."},
                headers={"Retry-After": str(retry_after)},
            )
            await response(scope, receive, send)
            return

        await self.app(scope, receive, send)
