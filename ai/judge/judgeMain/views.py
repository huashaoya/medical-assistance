from django.shortcuts import render
from django.http import HttpResponse
import json
import os
import time
import argparse
import matplotlib.pyplot as plt
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

current_path = os.path.dirname(__file__)  # 当前路径

"""
需要指定参数：--name dsb2018_96_NestedUNet_woDS
"""

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

def upload(request):#先保存上传的文件
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
    type=request.POST.dict().get('type')
    img1 =''
    img2=''
    img3=''
    filePath = upload(request)
    global y, x
    #args = parse_args()
    #with open('models/%s/config.yml' % args.name, 'r') as f:
    modelUrl=''
    if(type=='0'):
        modelUrl='models/breast_cancer_promotion/config.yml'
        print('乳腺癌')
    else:
        modelUrl = 'models/blood_cancer/config.yml'
        print('血癌')
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

            Area = Area + str(area) + ', '
            PERIMETER = PERIMETER + str(perimeter) + ', '
            LEFT = LEFT + str(left) + ', '
            RIGHT = RIGHT + str(right) + ', '
            TOP = TOP + str(top) + ', '
            BOTTOM = BOTTOM + str(bottom) + ', '

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
            LEFTTOP_POINT = LEFTTOP_POINT + '(' + str(start_point[0]) + ',' + str(start_point[1]) + '), '
            RIGHTDOWN_POINT = RIGHTDOWN_POINT + '(' + str(end_point[0]) + ',' + str(end_point[1]) + '), '
            CENTER_POINT = CENTER_POINT + '(' + str((start_point[0] + end_point[0]) / 2.0) + ',' + str(
                (start_point[1] + end_point[1]) / 2.0) + '), '
            WIDTH = WIDTH + str(width) + ', '
            HEIGHT = HEIGHT + str(height) + ', '

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

    torch.cuda.empty_cache()
    result = {"message": 'success', "code": '200',
              "img1":'http://127.0.0.1:8000/static/'+img1,
              "img2": 'http://127.0.0.1:8000/static/' + img2,
              "img3": 'http://127.0.0.1:8000/static/' + img3,
              }

    return HttpResponse(json.dumps(result), content_type="application/json")
