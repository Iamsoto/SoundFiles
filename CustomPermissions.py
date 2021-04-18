from rest_framework import permissions

class ValidEmail(permissions.BasePermission):
    """
        Does user have valid email to see this?
    """
    message = 'Please validate your email'
    code = 'detail'
    def has_permission(self, request, view):
        return request.user.valid_email