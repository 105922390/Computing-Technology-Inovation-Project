import unittest
from types import SimpleNamespace
from unittest.mock import patch

from starlette.requests import Request

from server import logout, user_data


def make_request(session: dict) -> Request:
    return Request({"type": "http", "headers": [], "session": session})


class UserSessionEndpointTests(unittest.TestCase):
    def test_user_data_reports_logged_out_without_session(self) -> None:
        self.assertEqual(user_data(make_request({})), {"logged_in": False})

    def test_user_data_returns_public_profile_for_logged_in_session(self) -> None:
        user = SimpleNamespace(
            id=123,
            username="JohnBox",
            password_hash="must-not-be-returned",
        )

        with patch("server.get_user", return_value=user):
            result = user_data(make_request({"user_id": 123}))

        self.assertEqual(
            result,
            {
                "logged_in": True,
                "user": {"id": 123, "username": "JohnBox"},
            },
        )

    def test_user_data_reports_logged_out_if_session_user_is_missing(self) -> None:
        with patch("server.get_user", return_value=None):
            result = user_data(make_request({"user_id": 123}))

        self.assertEqual(result, {"logged_in": False})

    def test_logout_clears_the_current_session(self) -> None:
        request = make_request({"user_id": 123})

        result = logout(request)

        self.assertIsNone(result)
        self.assertEqual(request.session, {})


if __name__ == "__main__":
    unittest.main()
