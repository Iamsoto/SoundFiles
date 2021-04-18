from rest_framework.throttling import AnonRateThrottle
from rest_framework.throttling import UserRateThrottle

"""
	For now, both users and Anonymous users have the same 
	throttle speeds
"""

class UserBurstRateThrottle(UserRateThrottle):
    scope = 'burst'

class UserSustainedRateThrottle(UserRateThrottle):
    scope = 'sustained'


class AnonBurstRateThrottle(AnonRateThrottle):
	scope = 'burst'

class AnonSustainedRateThrottle(AnonRateThrottle):
	scope = 'sustained'