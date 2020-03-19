import React from 'react';

const SignalSlots = (props) => {
    
    const drop = e => {
        e.preventDefault()
        const inf = JSON.parse(e.dataTransfer.getData('module'));

        props.setModule(...inf, props.index, props.supportFrame_index)
    }

    const dragOver = e => {
        e.preventDefault()
    }

    const className = props.componentClassName+"-signal-slots";
    const classNameList = [
        className,
        (props.Configuration.Modules[props.index].display) ? `${className}--displayed` : `${className}--hiden`,
        ((props.Configuration.Modules[props.index].module_type)==="Power Sockets")?`${className}--ps` : null,
    ].filter(Boolean).join(" ");
    return <img
        className={classNameList}
        src={props.Configuration.Modules[props.index].img}
        alt="signal-slot"
        onDrop={drop}
        onDragOver={dragOver}
    />
}

const PowerSocket = (props) => {
    return <img
        className={props.componentClassName+"-power-sockets"}
        src={"img/signalslots ipl/power sockets/" + props.Configuration.platformСhoiceDesc.powerSocketArticle + ".png"}
        alt="power-sockets"
    />
}

const ConferenceControl = (props) => {
    return <img
        className={props.componentClassName+"-conference-control"}
        src={"img/layout-parts/conference-control-min.png"}
        alt="conference-control"
    />
}

const ConferenceControlDoubleFrame = (props) => {
    return <img
        className={props.componentClassName+"-conference-control-double-frame"}
        src={"img/layout-parts/conference-control-double-frame-min.png"}
        alt="conference-control-double-frame"
    />
}

const Table = (props) => {
    const platformСhoiceDesc = props.Configuration.platformСhoiceDesc;
    const componentClassName = "conf-main-left-middle-container_l1-layout-table"

    const layOut_content = () => {
        const powerSokets = Array(platformСhoiceDesc["power-sockets"]).fill().map((_, index) => <PowerSocket 
            Configuration={props.Configuration} 
            componentClassName={componentClassName+"-middle"}
            key={'power-sockets_'+index}
        />)
        const conferenceControl = Array(platformСhoiceDesc["conference-control"]).fill().map((_, index) => <ConferenceControl 
            Configuration={props.Configuration} 
            componentClassName={componentClassName+"-middle"}
            key={'conference-control_'+index}
        />)
        const conferenceControlDoubleFrame = Array(platformСhoiceDesc["conference-control-double-frame"]).fill().map((_, index) => <ConferenceControlDoubleFrame
            Configuration={props.Configuration} 
            componentClassName={componentClassName+"-middle"}
            key={'conference-control-double-frame_'+index}
        />)
        const signalSlots = (<div
            style={platformСhoiceDesc["signal-slots"] ? {display: "flex"} : {display: "none"}}
            className={componentClassName+"-middle-container"}
            key={'signal-slots'}
        >{Array(platformСhoiceDesc["signal-slots"]).fill().map((_, index) => <SignalSlots
            Configuration={props.Configuration}
            componentClassName={componentClassName+"-middle-container"}
            index={index}
            setModule={props.setModule}
            key={'signal-slot_'+index}
        />)}</div>);
        let pos;
        if (powerSokets.length > 2) {
            pos = 2;
        } else if (platformСhoiceDesc["conference-control"] || platformСhoiceDesc["conference-control-double-frame"]) {
            pos = 0;
        } else {
            pos = 1;
        }
        powerSokets.splice(pos, 0, ...conferenceControlDoubleFrame, ...conferenceControl, signalSlots);
        return (powerSokets);
    }
    return (
        <div className={componentClassName}>
            <div className={componentClassName+"-top"} />
            <div className={componentClassName+"-middle"}>
                {layOut_content()}
            </div>
            <div className={componentClassName+"-bottom"} />
        </div>
    );
}

const PremiumLineIPL = (props) => {
    const platformСhoiceDesc = props.Configuration.platformСhoiceDesc
    const componentClassName = "conf-main-left-middle-container_l1-layout-wall-premium-line-ipl"
    const isCoverHiden = (className) => className+" "+((platformСhoiceDesc.isCoverHiden) ? className+"--hiddenCover" : "");
    
    return (
        <div draggable="true" className={isCoverHiden(componentClassName)}>
            {platformСhoiceDesc.support_frame_arr.map((supp_frame, i, support_frame_arr) => {
                const global_frame_index = support_frame_arr.slice(0, i).reduce((sum, supp_frame) => sum+=supp_frame["frame-width"], 0)
                return (
                    <div key={i} className={isCoverHiden(componentClassName+"-support-frame")}>
                        {(platformСhoiceDesc.isCoverHiden) ? <div className={componentClassName+"-support-frame--hiddenCover-left-attachment-point"} />:null}
                        <div className={isCoverHiden(componentClassName+"-support-frame-top")}>
                            <span className={isCoverHiden("dot")}/>
                        </div>
                        <div className={isCoverHiden(componentClassName+"-support-frame-middle")}>
                            {Array(supp_frame["frame-width"]).fill().map((_, index) => <SignalSlots
                                key={index+i.toString()}
                                Configuration={props.Configuration}
                                componentClassName={componentClassName+"-support-frame-middle"}
                                index={global_frame_index+index}
                                setModule={props.setModule}
                                supportFrame_index={i}
                            />)}
                        </div>
                        <div className={isCoverHiden(componentClassName+"-support-frame-bottom")}>
                            <span className={isCoverHiden("dot")}/>
                        </div>
                        {(platformСhoiceDesc.isCoverHiden) ? <div className={componentClassName+"-support-frame--hiddenCover-right-attachment-point"} />:null}
                    </div>
                )
            })}
        </div>
    )
}

const StandartLineIPL = (props) => {
    const platformСhoiceDesc = props.Configuration.platformСhoiceDesc
    const componentClassName = "conf-main-left-middle-container_l1-layout-wall-standart-line-ipl"
    
    return (
        <div className={componentClassName}>
            <img
                className={componentClassName+"-frame-img"}
                src={platformСhoiceDesc.img}
                alt=""
            />
        </div>
    )
}

const UniversalLineWP = (props) => {
    const platformСhoiceDesc = props.Configuration.platformСhoiceDesc
    const componentClassName = "conf-main-left-middle-container_l1-layout-wall-universal-line-wp"

    const layOut_height = {height: 165+platformСhoiceDesc["offset-px"]+"px"}
    
    return (
        <div draggable="true" className={componentClassName} style={layOut_height}>
            <img
                className={componentClassName+"-frame-img"}
                src={platformСhoiceDesc.img}
                alt=""
            />
            <div
                className={componentClassName+"-support-frame"}
            >
                {Array(platformСhoiceDesc['signal-slots']).fill().map((_, index) => <SignalSlots
                    key={index}
                    Configuration={props.Configuration}
                    componentClassName={componentClassName+"-support-frame"}
                    index={index}
                    setModule={props.setModule}
                    supportFrame_index={0}
                />)}
            </div>
        </div>
    )
}

const ConfLayOutFloor = (props) => {
    return (
        <div className="conf-main-left-middle-container_l1-layout-floor">
             
        </div>
    )
}

export {Table, PremiumLineIPL, StandartLineIPL, UniversalLineWP , ConfLayOutFloor};