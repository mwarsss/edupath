# permissions.py
from rest_framework.permissions import BasePermission


class IsStaffOrAdmin(BasePermission):
    """
    Allows access only to staff or admin users.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['staff', 'admin']
