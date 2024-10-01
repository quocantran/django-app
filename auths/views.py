from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CustomTokenObtainPairSerializer
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view , permission_classes

from rest_framework_simplejwt.tokens import RefreshToken
from users.serializers import UserCreateSerializer
from roles.models import Role




User = get_user_model()

class CustomTokenObtainPairView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = CustomTokenObtainPairSerializer(data=request.data)
        if serializer.is_valid():
            tokens = serializer.validated_data
            access_token = tokens['access']
            refresh_token = tokens['refresh']

            # Lấy thông tin người dùng
            user = User.objects.select_related('role').get(email=request.data['email'])

            role = Role.objects.prefetch_related('permissions').get(id=user.role.id)
            
            permissions_data = [
                {
                    'id': permission.id,
                    'name': permission.name,
                    'api_path': permission.api_path,
                    'method': permission.method,
                    'module': permission.module
                }
                for permission in role.permissions.all()
            ]

            user_data = {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role' : {
                    'id' : user.role.id,
                    'name' : user.role.name
                },
                'permissions' : permissions_data
            }

            User.objects.filter(email=request.data['email']).update(refresh_token=refresh_token)

            response = Response({
                'access_token': access_token,
                'user': user_data
            }, status=status.HTTP_200_OK)

            # Đính refresh_token lên cookies
            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                max_age=604800,  # 7 ngày
                httponly=True,
                secure=True,  # Đảm bảo chỉ gửi cookie qua HTTPS
                samesite='Strict'  # Ngăn chặn CSRF
            )

            return response

        return Response("Tài khoản hoặc mật khẩu không đúng!", status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            if refresh_token is None:
                raise ValueError("No refresh token found in cookies")

            token = RefreshToken(refresh_token)
            token.blacklist()
            
            
            response = Response({"message": "LOGOUT SUCCESS"}, status=status.HTTP_200_OK)
            response.delete_cookie('refresh_token')
            return response
        except Exception as e:
            
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def RefreshTokenView(request):
    try:
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token is None:
            raise ValueError("No refresh token found in cookies")

        # Tạo đối tượng RefreshToken từ refresh token hiện tại
        token = RefreshToken(refresh_token)
        
        # Tạo access token mới từ refresh token hiện tại
        access_token = str(token.access_token)
        
        # Tạo refresh token mới
        new_refresh_token = str(RefreshToken())

        # Lấy thông tin người dùng từ refresh token hiện tại
        user = User.objects.select_related('role').get(refresh_token=refresh_token)

        role = Role.objects.prefetch_related('permissions').get(id=user.role.id)
        
        permissions_data = [
            {
                'id': permission.id,
                'name': permission.name,
                'api_path': permission.api_path,
                'method': permission.method,
                'module': permission.module
            }
            for permission in role.permissions.all()
        ]

        user_data = {
            'id': user.id,
            'email': user.email,
            'name': user.name,
            'role' : {
                'id' : user.role.id,
                'name' : user.role.name
            },
            'permissions' : permissions_data
        }
        
        User.objects.filter(refresh_token=refresh_token).update(refresh_token=new_refresh_token)

        response = Response({
            'access_token': access_token,
        
            'user': user_data
        }, status=status.HTTP_200_OK)

        # Đính refresh_token mới lên cookies
        response.set_cookie(
            key='refresh_token',
            value=new_refresh_token,
            max_age=604800,  # 7 ngày
            httponly=True,
            secure=True,  # Đảm bảo chỉ gửi cookie qua HTTPS
            samesite='Strict'  # Ngăn chặn CSRF
        )

        return response
    except Exception as e:
        return Response("Invalid Token!", status=status.HTTP_401_UNAUTHORIZED)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetAccountView(request):
    try:
        usr_id = request.user.id

        # Lấy thông tin người dùng từ refresh token hiện tại
        user = User.objects.select_related('role').get(id=usr_id)

        role = Role.objects.prefetch_related('permissions').get(id=user.role.id)
        
        permissions_data = [
            {
                'id': permission.id,
                'name': permission.name,
                'api_path': permission.api_path,
                'method': permission.method,
                'module': permission.module
            }
            for permission in role.permissions.all()
        ]

        user_data = {
            'id': user.id,
            'email': user.email,
            'name': user.name,
            'role' : {
                'id' : user.role.id,
                'name' : user.role.name
            },
            'permissions' : permissions_data
        }

        return Response({'user' : user_data}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response("Invalid Token!", status=status.HTTP_401_UNAUTHORIZED)

class RegisterView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)