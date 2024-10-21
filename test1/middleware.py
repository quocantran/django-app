# myproject/middleware.py

from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from rest_framework.response import Response
import jwt
from django.conf import settings
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from users.models import User
from roles.models import Role
import json

class CustomResponseMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        data = None
        if isinstance(response, JsonResponse):
            try:
                data = json.loads(response.content)
            except json.JSONDecodeError:
                data = None

            if response.status_code >= 400:
                # Trích xuất thông báo lỗi từ phản hồi JSON
                error_messages = []
                if isinstance(data, dict):
                    for field, messages in data.items():
                        if isinstance(messages, list):
                            error_messages.extend(messages)
                        else:
                            error_messages.append(messages)
                else:
                    error_messages.append(str(data))

                formatted_response = {
                    'statusCode': response.status_code,
                    'message': error_messages,
                    'error': 'error'
                }
                return JsonResponse(formatted_response, status=response.status_code)
            else:
                formatted_response = {
                    'statusCode': response.status_code,
                    'data': data
                }
                return JsonResponse(formatted_response, status=response.status_code)
        elif isinstance(response, Response):
            data = response.data
            if response.status_code >= 400:
                # Trích xuất thông báo lỗi từ phản hồi JSON
                error_messages = []
                if isinstance(data, dict):
                    for field, messages in data.items():
                        if isinstance(messages, list):
                            error_messages.extend(messages)
                        else:
                            error_messages.append(messages)
                else:
                    error_messages.append(str(data))

                formatted_response = {
                    'statusCode': response.status_code,
                    'message': error_messages,
                    'error': 'error'
                }
                response.data = formatted_response
                response.content = response.rendered_content
            else:
                formatted_response = {
                    'statusCode': response.status_code,
                    'data': data
                }
                response.data = formatted_response
                response.content = response.rendered_content
        return response
    
class CustomExceptionMiddleware(MiddlewareMixin):
    def process_exception(self, request, exception):
        print(exception)
        return JsonResponse({'statusCode': 500, 'message': 'error', 'error': str(exception)}, status=500)
    

class PermissionMiddleware(MiddlewareMixin):
    def process_request(self, request):
        
        public_api = [
            '/api/v1/auth/account',
            '/api/v1/auth/logout',
            '/api/v1/resumes/by-user',
            '/api/v1/auth/login',
            '/api/v1/auth/register',
            '/api/v1/companies/follow',
            '/api/v1/files/upload',
            '/api/v1/auth/logout',
            '/api/v1/companies/unfollow',
            '/api/v1/auth/refresh',
            '/api/v1/otps',
            '/api/v1/users/password/forgot-password',
            '/api/v1/resumes/by-job',
        ]

        if request.path == '/api/v1/companies' and (request.method == 'GET' or request.method == 'OPTIONS'):
            return None

        if request.path == '/api/v1/jobs' and (request.method == 'GET' or request.method == 'OPTIONS'):
            return None

        if request.path.startswith('/api/v1/companies/get-one/'):
            return None
        if request.path.startswith('/api/v1/jobs/get-one/'):
            return None
        if request.path.startswith('/api/v1/comments'):
            return None
        if request.path.startswith('/api/v1/users') and request.path.endswith('/password'):
            return None

        # Kiểm tra nếu đường dẫn là công khai
        if request.path in public_api:
            return None

        auth_header = request.headers.get('Authorization')
        if auth_header:

            try:
                # Tách token từ header
                token = auth_header.split(' ')[1]
                # Giải mã token để lấy user_id
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                user_id = payload['user_id']
            
            except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, IndexError):
                return JsonResponse({
                    'statusCode': 401,
                    'message': 'error',
                    'error': 'Token is invalid'
                }, status=401)

            try:
                # Lấy user từ user_id
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return JsonResponse({
                    'statusCode': 401,
                    'message': 'error',
                    'error': 'Token is invalid'
                }, status=401)

            # Lấy role của user
            usr_role = user.role

            # Lấy tất cả các permission của role
            permissions = list(Role.objects.get(id=usr_role.id).permissions.all())
            # Lấy api_path và method từ request
            api_path = request.path
            method = request.method
            # Kiểm tra xem role có permission với api_path và method không
            for permission in permissions:
                if permission.api_path == api_path and permission.method == method:
                    request.user = user
                    print(permission.api_path, permission.method)
                    return None
                elif permission.method == method and permission.api_path.endswith('/:id') and len(api_path.split("/")) == len(permission.api_path.split("/")) and api_path.split("/")[3] == permission.api_path.split("/")[3]:
                        request.user = user
                        print(permission.api_path, permission.method)
                        return None

            return JsonResponse({
                    'statusCode': 403,
                    'message': 'error',
                    'error': 'Permission denied'
                }, status=403)
        

     