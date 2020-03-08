import React from "react";
import ReactDOM from 'react-dom';
import './main.css';
import * as faceapi from 'face-api.js';
import { FaceMatcher } from "face-api.js";

class Main extends React.Component {

    public state = {
        imgSrc: '',
        fileInput: Element
    }

    faceMatcher: FaceMatcher | undefined;

    constructor(props: Readonly<{}>) {
        super(props);
        this.uploadRefImage = this.uploadRefImage.bind(this);
    }

    async uploadRefImage(e: any) {
        const imgFile = e.target.files[0];
        const img = await faceapi.bufferToImage(imgFile);
        this.setState({
            imgSrc: img.src
        });
        this.updateReferenceImageResults();
    }
    fileInput(fileInput: any) {
        throw new Error("Method not implemented.");
    }

    async updateReferenceImageResults() {
        const inputImgEl = this.refs.refImg;
        const canvas = this.refs.refImgOverlay;


        const fullFaceDescriptions = await faceapi
            .detectAllFaces(inputImgEl as faceapi.TNetInput)
            .withFaceLandmarks()
            .withFaceDescriptors()

        if (!fullFaceDescriptions.length) {
            return
        }

        // create FaceMatcher with automatically assigned labels
        // from the detection results for the reference image
        this.faceMatcher = new faceapi.FaceMatcher(fullFaceDescriptions)

        faceapi.matchDimensions(canvas as unknown as faceapi.IDimensions, inputImgEl as unknown as faceapi.IDimensions)
        // resize detection and landmarks in case displayed image is smaller than
        // original size
        const resizedResults = faceapi.resizeResults(fullFaceDescriptions, inputImgEl as unknown as faceapi.IDimensions)
        // draw boxes with the corresponding label as text
        const labels = this.faceMatcher.labeledDescriptors
            .map(ld => ld.label)
        resizedResults.forEach(({ detection, descriptor }) => {
            if (this.faceMatcher !== undefined) {
                const label = this.faceMatcher.findBestMatch(descriptor).toString()
                const options = { label }
                const drawBox = new faceapi.draw.DrawBox(detection.box, options)
                drawBox.draw(canvas as HTMLCanvasElement)
            }
        });
    }

    async componentDidMount() {
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models')
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models')
    }

    render() {
        return (
            <div>
                <header>wear mask</header>
                <h1>请选择人像图片上传，上传后有点卡，稍等</h1>
                <div className="panel" >
                    <div className="panel-c " >
                        <img ref="refImg" src={this.state.imgSrc} />
                        <canvas ref="refImgOverlay" className="overlay" />
                    </div>
                </div>
                <input id="inputImgEl" type="file" onChange={this.uploadRefImage} accept=".jpg, .jpeg, .png" />
            </div>
        );
    }
}

export default Main