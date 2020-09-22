import React, {useState, useEffect, useRef, Dispatch, SetStateAction} from 'react';
import {AppProps} from '../../Utils';
import './Navigation.scss'

const Navigation: React.FC<{navProps:AppProps ,arrIndex: number}> = ({navProps, arrIndex}) => {

    return (
        <div className="navigation" style={{display: 'flex', justifyContent: 'start', alignItems: 'center',height: 40,
            textAlign: 'center',
            color: '#2E159F',width:"100%"

            }}>
            {navProps.screens.map((step, index) => {
                return <div className="link" style={{width:'100%'}}>
                    <p  key={index} style={{
                        marginRight: arrIndex == navProps.screens.length-1? 0: 10,
                        color: arrIndex === index ? 'white' : '#2E159F',
                        fontSize:20,
                        backgroundColor: arrIndex === index ? '#2E159F' : '#EDEDED',
                        paddingTop:10,
                        paddingBottom:10,
                        width:'100%',
                        fontFamily:'Montserrat, sans-serif',
                        fontWeight:'lighter'
                    }}>{navProps.screens[index]}</p>
                </div>
            })}
        </div>
    );
}

export default Navigation;



