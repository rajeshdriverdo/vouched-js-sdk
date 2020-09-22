import React, {useState} from 'react';
import './App.css';
import {AppProps} from "./Utils";
import IDCameraStep from "./components/IDCameraStep/IDCameraStep";
import FaceCameraStep from "./components/FaceCameraStep/FaceCameraStep";
import Result from "./components/Result/Result";
import Navigation from "./components/Navigation/Navigation";

const App: React.FC<{ navProps: AppProps }> = ({navProps}) => {
    const arrSize = navProps.screens.length;
    const [arrIndex, setArrIndex] = useState(0);

    const nextButtonClicked = () => {
        if (arrIndex < arrSize - 1)
            setArrIndex(arrIndex + 1);
    }
    const previousButtonClicked = () => {
        if (arrIndex > 0)
            setArrIndex(arrIndex - 1);
    }

    return (
        <div className="App">
            <Navigation
                navProps={navProps}
                arrIndex={arrIndex}/>

            {navProps.screens[arrIndex] === "ID" ?
                <IDCameraStep
                    nextButtonClicked={nextButtonClicked}
                    previousButtonClicked={previousButtonClicked}
                    arrIndex={arrIndex}
                    setArrIndex={setArrIndex}/> : null}

            {navProps.screens[arrIndex] === "Face" ?
                <FaceCameraStep
                    nextButtonClicked={nextButtonClicked}
                    previousButtonClicked={previousButtonClicked}
                    arrIndex={arrIndex}
                    setArrIndex={setArrIndex}/> : null}

            {navProps.screens[arrIndex] === "Result" ?
                <Result nextButtonClicked={nextButtonClicked}
                        previousButtonClicked={previousButtonClicked}
                        arrIndex={arrIndex}
                        setArrIndex={setArrIndex}/> : null}
        </div>
    );
}

export default App;

