from django.shortcuts import render
from .models import qna
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from .serializers import QnaSerializer, Qna_A_Serializer
from rest_framework.exceptions import ValidationError
from .validators import validate_file_extension

def qna_home(request):
    qna_posts = qna.objects.all()
    return render(request, 'qna/qna_post.html', {'qna_posts': qna_posts})

@api_view(['GET'])
def qna_list(request):
    qna_posts = qna.objects.all()
    data = [{'no': post.no, 'user_info': post.user_info, 'question': post.question, 'answer': post.answer, 'user_img': str(post.user_img.url) if post.user_img else None} for post in qna_posts]

    for item in data:
        if item['user_img']:
            item['user_img'] = item['user_img']

    return Response(data)

class QnaCreate(generics.CreateAPIView):
    queryset = qna.objects.all()
    serializer_class = QnaSerializer

    def create(self, request, *args, **kwargs):
        user_info = request.data.get('user_info')
        question = request.data.get('question')
        user_img = request.FILES.get('user_img')

        # File extension validation
        if user_img:
            try:
                validate_file_extension(user_img)
            except ValidationError as e:
                return Response({'message': "허용되지 않은 파일 형식입니다."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            new_qna = qna.objects.create(user_info=user_info, question=question, user_img=user_img)
            new_qna.save()
            print('등록 성공!!')
            return Response({'message': '등록 성공!!'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            print('등록 실패:', str(e))
            return Response({'message': '등록 실패!!'}, status=status.HTTP_400_BAD_REQUEST)

class QnaUpdate(generics.UpdateAPIView):
    queryset = qna.objects.all()
    serializer_class = Qna_A_Serializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response({'message': '답변이 성공적으로 업데이트되었습니다.'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def qna_detail(request):
    qna_posts = qna.objects.filter(no=22)

    if qna_posts.exists():
        data = []
        for qna_post in qna_posts:
            user_img = None
            if qna_post.user_img:
                user_img = qna_post.user_img.url

            data.append({
                'no': qna_post.no,
                'user_info': qna_post.user_info,
                'question': qna_post.question,
                'answer': qna_post.answer,
                'user_img': user_img
            })
        return Response(data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def qna_update(request, pk):
    try:
        qna_post = qna.objects.get(pk=pk)
    except qna.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    qna_post.user_info = request.data.get('user_info', qna_post.user_info)
    qna_post.question = request.data.get('question', qna_post.question)
    qna_post.answer = request.data.get('answer', qna_post.answer)
    qna_post.user_img = request.FILES.get('user_img', qna_post.user_img)

    # File extension validation
    if qna_post.user_img:
        try:
            validate_file_extension(qna_post.user_img)
        except ValidationError as e:
            return Response({'message': "허용되지 않은 파일 형식입니다."}, status=status.HTTP_400_BAD_REQUEST)

    qna_post.save()
    return Response({'message': '질문과 답변이 성공적으로 업데이트되었습니다.'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def qna_delete(request, pk):
    try:
        qna_post = qna.objects.get(pk=pk)
    except qna.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    qna_post.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT'])
def qna_answer_update(request, no):
    try:
        qna_post = qna.objects.get(no=20)
    except qna.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    qna_post.answer = request.data.get('answer', qna_post.answer)
    qna_post.save()

    return Response({'message': '답변이 성공적으로 업데이트되었습니다.'}, status=status.HTTP_200_OK)
