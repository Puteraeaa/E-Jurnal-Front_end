import React from 'react'
import '../CSS/SuspenseContent.css'

function SuspenseContent(){
    return(
        <div className="suspense-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="loadingspinner">
                <div id="square1"></div>
                <div id="square2"></div>
                <div id="square3"></div>
                <div id="square4"></div>
                <div id="square5"></div>
            </div>
        </div>
    )
}

export default SuspenseContent