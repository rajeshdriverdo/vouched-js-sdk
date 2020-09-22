# Vouched
[![npm version](https://img.shields.io/npm/v/@vouched.id/vouched-js.svg?style=flat-square)](https://www.npmjs.com/package/@vouched.id/vouched-js)

## Run the Example

1. Clone the repo and run `yarn install` from the example app directory
2. Setup the [environment variables](#environment-variables)
3. Run `yarn start` to launch the App

**1st Screen** - Card Detection   
**2st Screen** - Face Detection  
**3rd Screen** - ID Verification Results  

#### Features displayed in Example 
* ID Card and Passport Detection
* Face Detection (w and w/o liveness)
* ID Verification

## How to use the Vouched Library

### Install
Follow the Install Guide [here](https://www.npmjs.com/package/@vouched.id/vouched-js)

### Code
To use the SDK in your own project refer to the following code snippets.
The code snippets are based on [React](https://reactjs.org/) and [React Hooks](https://reactjs.org/docs/hooks-reference.html)

##### ID Card detection and submission
```
import {CardDetectFactory, CardDetect, Instruction, Step, VouchedUtils, VouchedSession, VouchedSessionParameters} from '@vouched.id/vouched-js';

// create one session per verification
let sessionParams : VouchedSessionParameters = { apiKey: API_KEY };
let session = new VouchedSession(sessionParams);

useEffect(() => {
    async function initCardDetect() {
        let cardDetect = await CardDetectFactory.get();
        setCardDetect(cardDetect);
    }
    initCardDetect();
}, []);

useEffect(() => {
    // Start video stream from device's camera
}, [cardDetect])

useEffect(() => {
    let unmounted = false;
    async function processVideoFrame() {
        if(unmounted) return;
        if(cardDetect && isVideoReady && videoRef.current) {
            const detectResult = await cardDetect.detect(videoRef.current);
            switch(detectResult.step) {
                case Step.preDetected:
                    // prompt user to show ID card
                case Step.detected:
                    // prompt user to hold steady
                case Step.postable:
                    if(!posted) {
                        try {
                            posted = true;
                            let job = await session.postFrontId(detectResult)
                            let retryableErrors = VouchedUtils.extractRetryableErrors(job)
                            if (retryableErrors.length > 0) {
                                // retry card detection
                            }
                        } catch(e) {
                            // handle error cases
                        }
                    }
            }
        }
        setTimeout(processVideoFrame, timeOut);
    }
    processVideoFrame();
    return () => {
        unmounted = true
    }
}, [cardDetect, isVideoReady]);

```

##### Face(Selfie) detection and submission
Same structure and logic as [ID Card](#id-card-detection-and-submission) but using FaceDetect instead of CardDetect

Initialize FaceDetect
```
let faceDetect = await FaceDetectFactory.get(LivenessMode.mouthMovement);
```
Post Face using the session
```
// make sure to use the same session instance created previously.
let job = await session.postFace(detectResult)
```

## Environment Variables

Set Environment Variables:

[React Environment Variables Reference](https://create-react-app.dev/docs/adding-custom-environment-variables/). 

At the root of the project, create a .env file with the following content:
```
REACT_APP_PUBLIC_API_KEY = <PUBLIC_KEY>
REACT_APP_API_URL = https://verify.vouched.id
```

## License

Vouched is available under the Apache License 2.0 license. See the LICENSE file for more info.