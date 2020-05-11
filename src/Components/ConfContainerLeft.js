import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {Table, ConfLayOutFloor, PremiumLineIPL, StandardLineIPL, UniversalLineWP, StandardLineWP} from './ConfLayOut';

const ConfContainerLeft = (props) => {
    return <div className="conf-main-left">
        <TopAndBottomMenu 
            className="conf-main-left-top-container"
            pathArray={[]}
            level={0}
            dataObj={props.framesForTopMenu}
            onClick={props.platformHandler}
            reseting={props.resetConfOnChange}
            frameResetHandler={props.frameResetHandler}
            draggable={false}
            pricelistinfo={props.pricelistinfo}
        />
        <ConfContainerLeftInstruction
            Language={props.Language}
            localStrings={props.localStrings}
            instNumArr={[1, 2]}
            className={"conf-main-left-instruction"}
        />
        <ConfContainerLeftMiddle 
            QuantityOfConf={props.QuantityOfConf}
            Configuration={props.Configuration}
            ConfNumberHandler={props.ConfNumberHandler}
            AddConfHandler={props.AddConfHandler}
            CoverHidenHandler={props.CoverHidenHandler}
            setModule={props.setModule}
            maxConfQuantity={props.maxConfQuantity}
            setPowerSocket={props.setPowerSocket}
        />    
        <TopAndBottomMenu 
            className="conf-main-left-bottom-container"
            pathArray={[]}
            level={0}
            dataObj={props.modulesForBottomMenu}
            draggable={Boolean(props.Configuration.platformСhoiceDesc && (props.Configuration.platformСhoiceDesc['signal-slots'] || props.Configuration.platformСhoiceDesc['power-sockets']))}
            line={props.Configuration.platformСhoiceDesc && props.Configuration.platformСhoiceDesc.line.match(/[A-Z0-9]{1,}$/)}
            location={props.Configuration.platformСhoiceDesc && props.Configuration.platformСhoiceDesc.location}
            pricelistinfo={props.pricelistinfo}
        />
        <ConfContainerLeftInstruction
            Language={props.Language}
            localStrings={props.localStrings}
            instNumArr={[13, 14]}
            className={"conf-main-left-instruction"}
        />
    </div>
}

const TopAndBottomMenu = props => {
    const filterFunc = inf => {
        const regex = /[A-Z]{1,}$/
        const bool = (
            (!props.line)
            ||
            (inf.match(regex)[0] === props.line[0])
            ||
            (/^[\d]{1,}/.test(props.line[0]) && inf.match(regex)[0] === "IPL")
        )
        return bool
    }
    const className=props.className+"_l"+props.level;
        return <Tabs className={className}>
            <TabList className={className+"-list"}>
                {Object.keys(props.dataObj).filter(inf => filterFunc(inf)).map(inf => <Tab 
                    className={className+"-list-tab"}
                    selectedClassName={className+"-list-tab--selected"}
                    key={inf}
                    onClick={(props.reseting) ? () => props.frameResetHandler() : null}
                >
                    {inf}
                </Tab>)}
            </TabList>
                {Object.keys(props.dataObj).filter(inf => filterFunc(inf)).map(inf => <TabPanel 
                    className={className+"-panel"} 
                    selectedClassName={className+"-panel--selected"} 
                    key={inf}
                >
                    {(props.level<1) ? 
                        <TopAndBottomMenu 
                            pathArray = {[...props.pathArray, inf]}
                            level = {props.level+1}
                            dataObj={props.dataObj[inf]}
                            className={props.className}
                            onClick={props.onClick}
                            draggable={props.draggable}
                            frameResetHandler={props.frameResetHandler}
                            location={props.location}
                            reseting={props.reseting}
                            pricelistinfo={props.pricelistinfo}
                        /> : <CardMenu 
                            pathArray = {[...props.pathArray, inf]}
                            level = {props.level+1}
                            dataObj={props.dataObj[inf]}
                            className={props.className}
                            onClick={props.onClick}
                            draggable={props.draggable}
                            pricelistinfo={props.pricelistinfo}
                        />
                    }
                </TabPanel>)}
        </Tabs>
}

const CardMenu = props => {
    const [selected, set_selected] = useState()

    const className = props.className+"_l"+props.level;

    const dragStart = (e, module) => {
        const containerNode = document.getElementById('slotNodeId')
        let containerNode_height = 0
        if (containerNode) {
            containerNode_height = containerNode.offsetHeight
        }

        const img = e.target.cloneNode(true)
        img.style.height=containerNode_height+'px'
        var div = document.createElement('div');
        div.appendChild(img);
        document.querySelector('body').appendChild(div);

        div.style.position="absolute"
        div.style.top="0"
        div.style.left="-"+img.offsetWidth+"px"
        
        e.dataTransfer.setDragImage(div, 15, img.offsetHeight/2)
        setTimeout(()=>div.remove(), 0)
        e.dataTransfer.setData('module', JSON.stringify(module))
    }

    const dragOver = e => {
        e.preventDefault();
    }
    return (
        <div className={className}>
            {props.dataObj.map((module, i, module_list) => {
                if (!module.article) {
                    Object.keys(module).forEach((key) => (module[key] == null) && delete module[key]);
                    module = {article_list: module}
                    module.sub_desc = Object.keys(module.article_list)[0]
                    module.article=module.article_list[module.sub_desc]
                };
                module.img = "img/" + props.pathArray.join("/").toLowerCase()+ "/" + module.article + ".png"
                return (
                    <div className={className+"-card"} key={className+"-card_"+i} id={className+"-card_"+i}>
                        <img
                            className={[className+"-card-img", (selected===i ? className+"-card-img--selected" : "")].join(" ")}
                            alt={module.article}
                            src={module.img}
                            key={className+"-card-img_"+i}
                            onClick={() => {
                                props.onClick && props.onClick(module, ...props.pathArray);
                                set_selected(i);
                            }}
                            onDragStart={e => props.draggable && dragStart(e, [module, ...props.pathArray])}
                            onDragOver={dragOver}
                            draggable={props.draggable}
                        />
                        <CardDesc
                            className={className+"-card-desc"}
                            isLeftPart={(i<module_list.length/2)}
                        >
                            {props.pricelistinfo[module.article] && props.pricelistinfo[module.article].description1}
                        </CardDesc>
                    </div>
                )
            })}
        </div>
    )
}

const CardDesc = props => {
    const container_offset = {[(props.isLeftPart ? "left" : "right")] : "50%"}
    const text_offset = {[props.isLeftPart ? "left" : "right"] : "0.4rem"}
    const arrow_offset = {[props.isLeftPart ? "left" : "right"] : "0"}
    const arrow_derection = {[props.isLeftPart ? "borderRight" : "borderLeft"] : "0.4rem solid black"}
    return (
        <div style={container_offset} className={props.className} >
            <span className={props.className+"-arrow"} style={{...arrow_offset, ...arrow_derection}} />
            <span className={props.className+"-text"} style={text_offset}>{props.children}</span>
        </div>
    )
}

const ConfContainerLeftInstruction = (props) => {
    return <div className={props.className}>
        <div className={props.className+"-container"}>
            {props.instNumArr.map(i => <p className={props.className+"-container-p"} key={i+props.className}>
                {(i>9) ? i-10 : i}. {props.localStrings[props.Language][i]}
            </p>)}
        </div>
    </div>
}

const ConfContainerLeftMiddle = (props) => {
    const elementClassName="conf-main-left-middle-container_l0"
    return <Tabs className={elementClassName}>
        <TabList className={elementClassName+"-list"}>
            {[...Array(props.QuantityOfConf).keys()].map((number) => <Tab
                className={elementClassName+"-list-tab"}
                selectedClassName={elementClassName+"-list-tab--selected"}
                onClick={props.ConfNumberHandler.bind(this, number)} 
                key={number}
            >
                Configuration: {number+1}
            </Tab>)}
            <button
                style={{display: (props.QuantityOfConf < props.maxConfQuantity) ? "inline-block" : "none"}}
                className="addTabs" 
                onClick={props.AddConfHandler.bind(this)}
            />
        </TabList>
        {[...Array(props.QuantityOfConf).keys()].map((number) => <TabPanel
            className={elementClassName+"-panel"}
            selectedClassName={elementClassName+"-panel--selected"}
            key={number}>
                {(props.Configuration.platformСhoiceDesc) ?
                    <RepresentationOfConf 
                        CoverHidenHandler={props.CoverHidenHandler}
                        Configuration={props.Configuration}
                        setModule={props.setModule}
                        setPowerSocket={props.setPowerSocket}
                    />
                : null}
        </TabPanel>)}
    </Tabs>
}

const RepresentationOfConf = (props) => {
    const elementClassName="conf-main-left-middle-container_l1"
    return <div className={elementClassName}>
        <ConfDesc
            platformСhoiceDesc={props.Configuration.platformСhoiceDesc}
            CoverHidenHandler={props.CoverHidenHandler}
        />
        {(props.Configuration.platformСhoiceDesc.location === "TABLE") ? 
            <Table
                Configuration={props.Configuration}
                setModule={props.setModule}
                setPowerSocket={props.setPowerSocket}
            /> 
        : (props.Configuration.platformСhoiceDesc.line === "Premium Line IPL") ? 
            <PremiumLineIPL
                Configuration={props.Configuration}
                setModule={props.setModule}
            />
        : (props.Configuration.platformСhoiceDesc.line === "Standard Line IPL") ? 
            <StandardLineIPL
                Configuration={props.Configuration}
            />
        : (props.Configuration.platformСhoiceDesc.line === "Universal Line WP") ? 
            <UniversalLineWP 
                Configuration={props.Configuration}
                setModule={props.setModule}
            />
        : (props.Configuration.platformСhoiceDesc.line === "Standard Line WP") ? 
            <StandardLineWP 
                Configuration={props.Configuration}
            />
        :
            <ConfLayOutFloor
                setModule={props.setModule}
                Configuration={props.Configuration} 
            /> 
        }
    </div>
}

const ConfDesc = (props) => {

    const elementClassName="conf-main-left-middle-container_l1-desc"
    return (
        <div  className={elementClassName}>
            <p>{props.platformСhoiceDesc.line} - Support frame</p>
            <ul>
                <li>{props.platformСhoiceDesc.line_desc}</li>
                <li>Type: Special</li>
                {(props.platformСhoiceDesc["support-frame_amount"]) ? <li>Support frame (x{props.platformСhoiceDesc["support-frame_amount"]})</li> : ''}
                {(props.platformСhoiceDesc.line==="Premium Line IPL") && <li>
                    Hide cover frame:
                    <button 
                        onClick={props.CoverHidenHandler.bind(this)} 
                        className={[elementClassName+"-check-box", (props.platformСhoiceDesc.isCoverHiden) ? elementClassName+"-check-box--hiden" : null].filter(Boolean).join(" ")}
                    >✓</button>
                </li>}
            </ul>
        </div>
    )
}

export default ConfContainerLeft;