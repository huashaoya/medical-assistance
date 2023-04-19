from django.http import HttpResponse
import json
import os
import time
import argparse
import numpy as np
import cv2
import torch
import torch.backends.cudnn as cudnn
import yaml
from albumentations.augmentations import transforms
from albumentations.core.composition import Compose
from tqdm import tqdm
import albumentations as albu
import judgeMain.archs as archs
from ultralytics import YOLO


def mask_find_bboxs(mask):
    retval, labels, stats, centroids = cv2.connectedComponentsWithStats(mask, connectivity=4)  # connectivity参数的默认值为8
    stats = stats[stats[:, 4].argsort()]
    return stats[:-1]  # 排除最外层的连通图

def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('--name', default='breast_cancer_promotion',
                        help='model name')
    args = parser.parse_args()
    return args

def upload(request):#保存上传的文件并返回绝对路径
    try:
        file = request.FILES.get('file', '')
        file_path = os.path.join(current_path, 'uploadFile')
        if not os.path.exists(file_path):  # 文件夹不存在则创建
            os.mkdir(file_path)
        fileName=str('{:.0f}'.format(time.time()))+file.name
        path=os.path.join(file_path,fileName)
        with open(path, 'wb') as fp:  # 写文件
            for i in file.chunks():
                fp.write(i)
    except Exception as e:
        result = {"message": 'err', "code": '400', "result": e}
        print(e)
        return ''
    return fileName#返回文件的保存路径

current_path = os.path.dirname(__file__)  # 当前路径
def video(request):#视频处理入口函数
    type = request.POST.dict().get('type')
    print(type)
    file_path = os.path.join(current_path, 'uploadFile')
    ff=upload(request)
    filePath = os.path.join(file_path, ff)  # 保存上传的文件并返回绝对路径

    #清空
    path = r'runs/detect/result1/labels/'
    data = os.listdir(os.path.join(current_path,'..',path))
    for i in data:
        i = path + i
        os.remove(os.path.join(current_path,'..',i))

    # 加载模型
    modelurl = r"runs/detect/train/weights/last.pt"
    model = YOLO(os.path.join(current_path,modelurl))
    model.track(
        # 输入视频路径
        source=filePath,
        # stream=True,
        tracker="bytetrack.yaml",  # or 'bytetrack.yaml'
        save=True,
        name="result1",
        conf=0.6,
        save_txt=True
    )

    path = r'runs/detect/result1/labels/'
    data = os.listdir(os.path.join(current_path,'..',path))
    num = []
    area = []
    X = len(data)

    for i in data:
        i = path + i
        file = open(i, 'r')
        p = file.readlines()
        num_flag = 0
        position = []
        max_area = 0.00
        for k in p:
            k = k.split('\n')[0]
            list = k.split(" ")
            temp = float(list[3]) * float(list[4])
            if temp > max_area:
                temp = round(temp, 2)
                max_area = temp
            num_flag += 1
        area.append(max_area)
        num.append(num_flag)
    print(X)
    print(num)
    print(area)
    #file.close()

    result = {"message": 'success',
              "code": '200',
              "X":X,
              "num": num,
              "area":area,
              "url1":'http://127.0.0.1:8000/static/'+ff,
              "url2":'http://127.0.0.1:8000/static/detect/result1/'+ff
              }

    return HttpResponse(json.dumps(result), content_type="application/json")

def listorders(request):#图像分割入口函数
    startTime= int(round(time.time() * 1000))
    type=request.POST.dict().get('type')
    img1 =''
    img2=''
    img3=''
    info={}
    file_path = os.path.join(current_path, 'uploadFile')
    filePath = os.path.join(file_path,upload(request))#保存上传的文件并返回绝对路径

    global y, x

    modelUrl=''
    if(type=='0'):
        modelUrl='models/breast_cancer_promotion/config.yml'
        print('乳腺癌')
    elif(type=='1'):
        modelUrl = 'models/blood_cancer/config.yml'
        print('血癌')
    else:
        modelUrl = 'models/pharyngolaryngeal_cancer_512/config.yml'
        print('下喉癌和咽癌')

    with open(os.path.join(current_path,modelUrl), 'r') as f:
        config = yaml.load(f, Loader=yaml.FullLoader)

    for key in config.keys():
        # print('%s: %s' % (key, str(config[key])))
        if key == 'input_h':
            x = config[key]
        if key == 'input_w':
            y = config[key]
    cudnn.benchmark = True

    # create model
    # print("=> creating model %s" % config['arch'])
    model = archs.__dict__[config['arch']](config['num_classes'],
                                           config['input_channels'],
                                           config['deep_supervision'])

    model = model.cuda()

    model.load_state_dict(torch.load(os.path.join(current_path,'models/%s/model.pth' %
                                     config['name'])))
    model.eval()

    val_transform = Compose([
        albu.Resize(config['input_h'], config['input_w']),
        transforms.Normalize(),
    ])
    # 导入图片
    img_input = r'models/breast_cancer_promotion/benign_1.png'
    print(filePath)
    img = cv2.imread(filePath, cv2.IMREAD_COLOR)
    input_x = img.shape[0]
    input_y = img.shape[1]
    segmentation_img = img.copy()
    contours_img = img.copy()

    arranged = val_transform(image=img)
    img = arranged['image']
    img = img.astype('float32') / 255
    img = img.transpose(2, 0, 1)

    val_loader = torch.utils.data.DataLoader(
        [img],
        batch_size=1,
        shuffle=False,
        num_workers=config['num_workers'],
        drop_last=False)

    with torch.no_grad():
        for input in tqdm(val_loader, total=len(val_loader)):
            input = input.cuda()
            output = model(input)
            output = torch.sigmoid(output).cpu().numpy()
            for i in range(len(output)):
                for c in range(config['num_classes']):
                    output[i, c] = (output[i, c] * 256).astype('uint8')
            output = np.squeeze(output, 0)
            output = np.resize(output, (x, y, 1))
            output = cv2.cvtColor(output, cv2.COLOR_GRAY2BGR)
            output = cv2.resize(output, (input_y, input_x))
            img1=str('{:.0f}'.format(time.time()))+'put.jpg'
            cv2.imwrite(os.path.join(current_path,'output',img1), output)  # 保存那个切割的黑白图片，输入路径

        for i in range(output.shape[0]):
            for k in range(output.shape[1]):
                for p in range(output.shape[2]):
                    # if output[i][k][p] == 0:
                    #     segmentation_img[i][k][p] = 255
                    if p == 1:
                        if output[i][k][p] == 0:
                            segmentation_img[i][k][p] = 255
                    else:
                        if output[i][k][p] == 0:
                            segmentation_img[i][k][p] = 0
        img2=str('{:.0f}'.format(time.time()))+'segmentation.jpg'
        cv2.imwrite(os.path.join(current_path,'output',img2), segmentation_img)  # 保存那个切割的原图图片，输入路径

        gray_img = cv2.cvtColor(output, cv2.COLOR_RGB2GRAY)
        ret, mask = cv2.threshold(gray_img, 127, 255, cv2.THRESH_BINARY)

        temp = mask.astype('uint8')
        contours, hierarchy = cv2.findContours(temp, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        contour_img = cv2.drawContours(contours_img, contours, -1, (0, 0, 255), 1)
        img3=str('{:.0f}'.format(time.time()))+'contours.jpg'
        cv2.imwrite(os.path.join(current_path,'output',img3), contour_img) # 保存那个轮廓画边的原图图片，输入路径
        #print(os.path.join(current_path,'output',str('{:.0f}'.format(time.time()))+'contours.jpg'))
        Area = ''
        PERIMETER = ''
        LEFT = ''
        RIGHT = ''
        TOP = ''
        BOTTOM = ''

        for cnt in contours:
            # cnt = contours[0]
            area = cv2.contourArea(cnt)
            area = round(area, 3)
            perimeter = cv2.arcLength(cnt, True)
            perimeter = round(perimeter, 3)
            left = tuple(cnt[cnt[:, :, 0].argmin()][0])
            right = tuple(cnt[cnt[:, :, 0].argmax()][0])
            top = tuple(cnt[cnt[:, :, 1].argmin()][0])
            bottom = tuple(cnt[cnt[:, :, 1].argmax()][0])

            Area = Area + str(area)
            PERIMETER = PERIMETER + str(perimeter)
            LEFT = LEFT + str(left)
            RIGHT = RIGHT + str(right)
            TOP = TOP + str(top)
            BOTTOM = BOTTOM + str(bottom)

        # plt.imshow(contour_img)
        # plt.show()
        mask = mask.astype('uint8')
        boxs = mask_find_bboxs(mask)

        LEFTTOP_POINT = ''
        RIGHTDOWN_POINT = ''
        CENTER_POINT = ''
        WIDTH = ''
        HEIGHT = ''
        for b in boxs:
            x0, y0 = b[0], b[1]
            x1 = b[0] + b[2]
            y1 = b[1] + b[3]
            width = b[2]
            height = b[3]
            start_point, end_point = (x0, y0), (x1, y1)
            LEFTTOP_POINT = LEFTTOP_POINT + '(' + str(start_point[0]) + ',' + str(start_point[1]) + ')'
            RIGHTDOWN_POINT = RIGHTDOWN_POINT + '(' + str(end_point[0]) + ',' + str(end_point[1]) + ')'
            CENTER_POINT = CENTER_POINT + '(' + str((start_point[0] + end_point[0]) / 2.0) + ',' + str(
                (start_point[1] + end_point[1]) / 2.0) + ')'
            WIDTH = WIDTH + str(width)
            HEIGHT = HEIGHT + str(height)


        print('图像分辨率 : (%d,%d)' % (input_y, input_x))
        print('左上角坐标 : ' + LEFTTOP_POINT)
        print('右下角坐标 : ' + RIGHTDOWN_POINT)
        print('中心坐标 ： ' + CENTER_POINT)
        print('区域宽度 : ' + WIDTH)
        print('区域高度 : ' + HEIGHT)
        print('区域面积 ： ' + Area)
        print('区域周长 : ' + PERIMETER)
        print('左极点坐标 : ' + LEFT)
        print('右极点坐标 : ' + RIGHT)
        print('上极点坐标 : ' + TOP)
        print('下极点坐标 : ' + BOTTOM)
        info={
            '图像分辨率': '('+str(input_y)+','+str(input_x)+')',
            '左上角坐标':LEFTTOP_POINT,
            '右下角坐标':RIGHTDOWN_POINT,
            '中心坐标':CENTER_POINT,
            '区域宽度' : WIDTH,
            '区域高度' : HEIGHT,
            '区域面积' :Area,
            '区域周长' : PERIMETER,
            '左极点坐标' : LEFT,
            '右极点坐标' : RIGHT,
            '上极点坐标' : TOP,
            '下极点坐标' :BOTTOM,
        }
    torch.cuda.empty_cache()
    endTime = int(round(time.time() * 1000))
    detalTime=endTime-startTime
    result = {"message": 'success', "code": '200',
              "img1":'http://127.0.0.1:8000/static/'+img1,
              "img2": 'http://127.0.0.1:8000/static/' + img2,
              "img3": 'http://127.0.0.1:8000/static/' + img3,
              "detalTime":detalTime,
              "info":info,
              "time":endTime
              }

    return HttpResponse(json.dumps(result), content_type="application/json")

def imageProcessing(request):#图像处理入口函数
    props = request.POST.dict()
    print(props)
    type=props.get('type')

    file_path = os.path.join(current_path, 'uploadFile')
    filePath = os.path.join(file_path, upload(request))  # 保存上传的文件并返回绝对路径
    img1 = str('{:.0f}'.format(time.time())) + '.jpg'

    #高斯滤波
    if type=='0':
        input_1 = int(props.get('input_1'))
        input_2 = int(props.get('input_2'))
        input_3 = int(props.get('input_3'))
        input_4 = int(props.get('input_4'))

        img = cv2.imread(filePath,cv2.IMREAD_COLOR)#高斯滤波输入图片
        img = cv2.GaussianBlur(img,(input_1,input_2),input_3,input_4)
        cv2.imwrite(os.path.join(current_path,'output',img1),img)#高斯滤波输出图片

    if type=='1':
        input_9= int(props.get('input_1'))
        input_10 = int(props.get('input_2'))
        input_11 = int(props.get('input_3'))
        input_12 = int(props.get('input_4'))

        img = cv2.imread(filePath,cv2.IMREAD_COLOR)#形态学腐蚀输入图片
        kernel_1 = np.ones((input_11,input_11),np.uint8)
        img = cv2.erode(img,kernel=kernel_1,anchor=(input_9,input_10),iterations=input_12)
        cv2.imwrite(os.path.join(current_path,'output',img1),img)#形态学腐蚀输出图片

    if type == '2':
        input_5 = int(props.get('input_1'))
        img = cv2.imread(filePath, cv2.IMREAD_COLOR)  # 中值滤波输入图片
        img = cv2.medianBlur(img,input_5)
        cv2.imwrite(os.path.join(current_path,'output',img1),img)#中值滤波输出图片

    if type == '3':
        input_13 = int(props.get('input_1'))
        input_14 = int(props.get('input_2'))
        img = cv2.imread(filePath,cv2.IMREAD_COLOR)#尺寸修改输入图片
        img = cv2.resize(img,(input_13,input_14))
        cv2.imwrite(os.path.join(current_path,'output',img1),img)#尺寸修改输出图片

    if type == '4':
        input_6 = int(props.get('input_1'))
        input_7 = int(props.get('input_2'))
        input_8 = int(props.get('input_3'))
        img = cv2.imread(filePath,cv2.IMREAD_COLOR)#双边滤波输入图片
        img = cv2.bilateralFilter(img,input_6,input_7,input_8)
        cv2.imwrite(os.path.join(current_path,'output',img1),img)#双边滤波输出图片

    if type == '5':
        input_15 = int(props.get('input_1'))
        input_16 = int(props.get('input_2'))
        input_17 = int(props.get('input_3'))
        input_18 = int(props.get('input_4'))
        img = cv2.imread(filePath,cv2.IMREAD_COLOR)#形态学膨胀输入图片
        kernel_2 = np.ones((input_17,input_17),np.uint8)
        img = cv2.dilate(img,kernel=kernel_2,anchor=(input_15,input_16),iterations=input_18)
        cv2.imwrite(os.path.join(current_path,'output',img1),img)#形态学膨胀输出图片

    result = {"message": 'success', "code": '200',
              "img1": 'http://127.0.0.1:8000/static/' + img1,
              }

    return HttpResponse(json.dumps(result), content_type="application/json")

