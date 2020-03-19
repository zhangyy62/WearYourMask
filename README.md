# 简介
利用reactjs + face-api.js实现人脸识别和给照片戴口罩功能  
这个春节因为疫情大家几乎都在家度过，好多人给微信头像戴口罩。之前就在想可否实现一个简单都给人脸照片戴口罩都工具，拖了好久终于动手了。非常非常简单  
地址：https://sparkxxxxxx.github.io/WearYourMask/index.html

# demo 
![demo](https://github.com/sparkxxxxxx/WEARYOURMASK/blob/master/assets/mask.gif)  

找了一男一女两个图做测试
# 资料准备
- react： 以前都是用 vuejs，最近 0 基础学习 react，练个手吧
- face-api.js:  github 上一个基于 tensorflow.js 带人脸识别库。资料如下。为啥识别这种问题不要问，问就是不懂，调库，干就完了。
https://github.com/justadudewhohacks/face-api.js

- 透明口罩素材： 百度搜索就可以了，随便找一个

# 开始

- 引入 face-api.js 
```
import * as faceapi from 'face-api.js';
```

- 初始化
```
async componentDidMount() {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
}
```
- 获取上传图片，并识别人脸68个特征点
``` 
const inputImgEl = this.refs.refImg;
const fullFaceDescriptions = await faceapi
    .detectAllFaces(inputImgEl as faceapi.TNetInput)
    .withFaceLandmarks()
    .withFaceDescriptors()
```

68个特征点如下，我们选用3，9，15，29四个点

- 选用后就该画口罩了
口罩用canvas画，canvas则需要放到人嘴鼻处，此处用到了上面68个特征点都数据。

fullFaceDescriptions[0].landmarks.positions
positions 是一个68个元素的数组，对应上面的特征值编号。最后用3, 9 , 15, 29的点来计算canvas 应该移动的位置就好了。
# 总结
原理就是如此简单，简单到我都没得可写了。这个代码实现的比较简单，很多情况其实并未处理，仅供参考和学习。
