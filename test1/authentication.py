from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import AuthenticationFailed

class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        public_api = [
            '/api/v1/auth/login',
            '/api/v1/auth/register',
            '/api/v1/files/upload',
            '/api/v1/companies',
            '/api/v1/auth/refresh',
            '/api/v1/otps',
            '/api/v1/jobs',
            '/api/v1/users/password/forgot-password',
            '/api/v1/resumes/by-job',
        ]

        if request.path.startswith('/api/v1/companies/get-one/'):
            return None
        if request.path.startswith('/api/v1/jobs/get-one/'):
            return None

        # Kiểm tra nếu đường dẫn là công khai
        if request.path in public_api:
            return None
            
        return super().authenticate(request)
