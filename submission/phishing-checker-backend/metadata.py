process_data_responses = {
       200: {
            "description": "URL evaluation has successfully completed.",
            "content": {
                "application/json": {
                    "example": {
						"result": {
							"error": None,
							"phish_prob": [
								15.9909457258148,
								2
							],
							"confidence": [
								84.00905427418522,
								2
							],
							"base_prob": 0.49990468668908106,
							"result_data": {
								"url_length": {
									"value": 11,
									"contribution": -0.08801699313384642
								},
								"host_length": {
									"value": 11,
									"contribution": -0.04517110908622282
								},
								"path_length": {
									"value": 0,
									"contribution": 0.06569785592634274
								},
								"num_dots_host": {
									"value": 1,
									"contribution": -0.05438307590402685
								},
								"num_hyphens_host": {
									"value": 0,
									"contribution": -0.026965448509327885
								},
								"num_digits": {
									"value": 0,
									"contribution": -0.037417619139108856
								},
								"digit_ratio": {
									"value": 0.0,
									"contribution": -0.032206265717841055
								},
								"num_special": {
									"value": 0,
									"contribution": -0.00251081287725513
								},
								"path_depth": {
									"value": 0,
									"contribution": -0.0533157645970418
								},
								"host_entropy": {
									"value": 3.095795255000934,
									"contribution": -0.02102395299035771
								},
								"has_ip": {
									"value": "example.com",
									"contribution": -0.01632937261087782
								},
								"has_at": {
									"value": "example.com",
									"contribution": -9.03356330948803e-07
								},
								"has_port": {
									"value": False,
									"contribution": -8.636737342314164e-06
								},
								"suspicious_tld": {
									"value": "com",
									"contribution": -0.013551053115127228
								},
								"suspicious_words": {
									"value": [],
									"contribution": -0.011620046655917135
								},
								"brand_not_in_domain": {
									"value": [],
									"contribution": -0.002508759489618807
								},
								"is_shortener": {
									"value": "example.com",
									"contribution": -0.0011619680149727626
								},
								"has_encoding": {
									"value": 0,
									"contribution": 0.0004986965779399246
								}
							}
						}
					}
                }
            },
        },
        503: {
            "description": "Too many requests - evaluation aborted.",
            "content": {
                "application/json": {
                    "example": {"detail": "Too many requests. Please retry later."}
						
                }
            },
        },
	}


login_responses = {
	200: {
		"description": "Server has successfully evaluated the user's data",
		"content": {
			"application/json": {
				"examples": {
					"success": {
						"summary": "Login succeeded",
						"value": {"success": True}
					},
					"error": {
						"summary": "Login failed",
						"value": {"error": "Invalid username of password"}
					},
					}
				},
			}
	},
	
	503: {
		"description": "Too many requests - login aborted.",
		"content": {
			"application/json": {
				"example": {"detail": "Too many requests. Please retry later."}
						
			}
		},
	},
}

signup_responses = {
	200: {
		"description": "Server has successfully evaluated the user's data",
		"content": {
			"application/json": {
				"examples": {
					"success": {
						"summary": "Account successfully created",
						"value": True
					},
					"error": {
						"summary": "Account not created",
						"value": False
					},
					}
				},
			}
	},
	
	503: {
		"description": "Too many requests - sign-up aborted.",
		"content": {
			"application/json": {
				"example": {"detail": "Too many requests. Please retry later."}
						
			}
		},
	},
}



username_available_responses = {
	200: {
		"description": "The server has successfully queried the database and determined the availability of the username",
		"content": {
			"application/json": {
				"examples": {
					"available": {
						"summary": "Username is available",
						"value": True
					},
					"unavailable": {
						"summary": "Username is not available",
						"value": False
					},
				}
			}
		}
	},
	503: {
		"description": "Too many requests - username lookup aborted.",
		"content": {
			"application/json": {
				"example": {"detail": "Too many requests. Please retry later."}
			}
		},
	},
}


logout_responses = {
	200: {
		"description": "The current session has been cleared.",
		"content": {
			"application/json": {
				"example": None
			}
		}
	},
	503: {
		"description": "Too many requests - logout aborted.",
		"content": {
			"application/json": {
				"example": {"detail": "Too many requests. Please retry later."}
			}
		},
	},
}


user_data_responses = {
	200: {
		"description": "Current session status and public user data, if logged in.",
		"content": {
			"application/json": {
				"examples": {
					"loggedOut": {
						"summary": "No active user session",
						"value": {"logged_in": False}
					},
					"loggedIn": {
						"summary": "Active user session",
						"value": {
							"logged_in": True,
							"user": {
								"id": 123,
								"username": "JohnBox"
							}
						}
					}
				}
			}
		}
	},
	503: {
		"description": "Too many requests - user lookup aborted.",
		"content": {
			"application/json": {
				"example": {"detail": "Too many requests. Please retry later."}
			}
		},
	},
}