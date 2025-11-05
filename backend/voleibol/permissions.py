from rest_framework.permissions import BasePermission

def group_required(*group_names):
    class _GroupPermission(BasePermission):
        def has_permission(self, request, view):
            u = request.user
            return (
                u.is_authenticated and
                (u.is_superuser or u.groups.filter(name__in=group_names).exists())
            )
    return _GroupPermission
