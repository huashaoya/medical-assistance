from django.shortcuts import render
from django.http import HttpResponse
import json
import os


current_path = os.path.dirname(__file__)  # 当前路径

def upload(request):#先保持上传的文件
    try:
        file = request.FILES.get('file', '')
        file_path = os.path.join(current_path, 'uploadFile')
        if not os.path.exists(file_path):  # 文件夹不存在则创建
            os.mkdir(file_path)
        path=os.path.join(file_path,str('{:.0f}'.format(time.time()))+file.name)
        with open(path, 'wb') as fp:  # 写文件
            for i in file.chunks():
                fp.write(i)
    except Exception as e:
        result = {"message": 'err', "code": '400', "result": e}
        print(e)
        return ''
    return path#返回文件的保存路径




def listorders(request):
    filePath = upload(request)
    result = {"message": 'success', "code": '200',
              "result": '<ul><li style="color:green">鉴别完成，感谢使用</li></ul>'}

    return HttpResponse(json.dumps(result), content_type="application/json")
