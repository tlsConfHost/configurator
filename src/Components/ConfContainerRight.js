import React, { useState , useEffect, Fragment} from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const ConfContainerRight = (props) => {
    return (
        <div className="conf-main-right">
            <ConfContainerRightTop 
              Configuration={props.Configurations[props.ConfNumber]}
              frame_sub_typeHandler={props.frame_sub_typeHandler}
            />
            <ConfContainerRightBottom
              Configurations={props.Configurations}
              QuantityOfConf={props.QuantityOfConf}
              ModuleMenuHandler={props.ModuleMenuHandler}
              ModuleResetHandler={props.ModuleResetHandler}
              frameResetHandler={props.frameResetHandler}
              printForm_handler={props.printForm_handler}
              pricelistinfo={props.pricelistinfo}
              powerSocketResetHandler={props.powerSocketResetHandler}
              powerSocketMenuHandler={props.powerSocketMenuHandler}
            />
        </div>
    );
}

const ConfContainerRightTop = (props) => {
  return (
    <div className="conf-main-right-top">
      {(props.Configuration.platformСhoiceDesc) ? <Fragment>
      <div className="conf-main-right-top-img-wrapper">
        <img
          className="conf-main-right-top-img"
          src={props.Configuration.platformСhoiceDesc.img}
          alt={props.Configuration.platformСhoiceDesc.line}
        />
      </div>
      <div className="conf-main-right-top-frameName">
        {(props.Configuration.platformСhoiceDesc.location === "TABLE") ? props.Configuration.platformСhoiceDesc.line : props.Configuration.platformСhoiceDesc.line_desc}
      </div>
      <div className="conf-main-right-top-subFrameMenu">
        {(props.Configuration.platformСhoiceDesc.frame_sub_type) ?  
          <FrameSubMenu 
            frame_sub_type={props.Configuration.platformСhoiceDesc.frame_sub_type}
            frame_sub_type_article={props.Configuration.platformСhoiceDesc.frame_sub_type_article}
            frame_sub_typeHandler={props.frame_sub_typeHandler}
          />
        : null}
      </div>
      </Fragment> : ''}
    </div>
  );
}

const FrameSubMenu = (props) => {
  const backgroundColor = (index) => {
    if (index % 2 === 0) {
      return "conf-main-right-top-subFrameMenu-list-line-light"
    } else {
      return "conf-main-right-top-subFrameMenu-list-line-dark"
    }
  }
  return (
    <div className="conf-main-right-top-subFrameMenu-list">
      {Object.keys(props.frame_sub_type).map((inf, index) => {
        return(
          <div key={inf} className={["conf-main-right-top-subFrameMenu-list-line", backgroundColor(index)].join(" ")}>
            <p style={{"fontWeight": (props.frame_sub_type[inf] === props.frame_sub_type_article) ? "bold" : null}} className="conf-main-right-top-subFrameMenu-list-line-text">{props.frame_sub_type[inf]} : {inf}</p>
            <button
              onClick={props.frame_sub_typeHandler.bind(this, {frame_sub_type_desc: inf, frame_sub_type_article: props.frame_sub_type[inf]})}
              className="conf-main-right-top-subFrameMenu-list-line-check-box"
            >
              {(props.frame_sub_type[inf] === props.frame_sub_type_article) ? "✓" : null}
            </button>
          </div>
        )
      })}
    </div>
  )
}

const ConfContainerRightBottom = (props) => {

  return (
    <Tabs className="conf-main-right-bottom_l0">
      <TabList className="conf-main-right-bottom_l0-list">
        {props.Configurations.map((conf, confNumber) => <Tab 
          className="conf-main-right-bottom_l0-list-tab" 
          selectedClassName="conf-main-right-bottom_l0-list-tab--selected" 
          key={confNumber}
        >
          Configuration {confNumber+1}
        </Tab>)}
      </TabList>
        {props.Configurations.map((conf, confNumber) => {
          return (<TabPanel 
            className="conf-main-right-bottom_l0-panel" 
            selectedClassName="conf-main-right-bottom_l0-panel--selected" 
            key={confNumber}
          >
            {(conf.platformСhoiceDesc) ? [
              <ConfList
                key={confNumber}
                confNumber={confNumber}
                Configuration={conf}
                ModuleMenuHandler={props.ModuleMenuHandler}
                ModuleResetHandler={props.ModuleResetHandler}
                frameResetHandler={props.frameResetHandler}
                pricelistinfo={props.pricelistinfo}
                powerSocketResetHandler={props.powerSocketResetHandler}
                powerSocketMenuHandler={props.powerSocketMenuHandler}
              /> ,
              <div key={confNumber+"wrapper"} className="conf-main-right-bottom_l1-print-conf-list">
                <button
                  key={confNumber+"button"}
                  className="conf-main-right-bottom_l1-print-conf-list-button"
                  onClick={() => props.printForm_handler(true, confNumber)}
                >
                  Print Configuration List
                </button>
              </div>
            ] : null}
          </TabPanel>)
        })}
    </Tabs>
  );
}

const ConfDescLine = props => {
  if (props.article) {
    return (<Fragment>
      <div>
        <div className={props.elementClassName+"-article"}>
          {props.article && props.article.toString().replace(/-/g, '-\n')}
        </div>
      </div>
      <div>
        <div>
          {props.MenuHandler&&props.MenuContent && <SubMenuRightBottom
            elementClassName={props.elementClassName+"-specs-menu"}
            MenuContent={props.MenuContent}
            MenuHandler={props.MenuHandler}
            index={props.index}
            confNumber={props.confNumber}
          />}
        </div>
      </div>
      <div className={props.elementClassName+"-desc"} id={props.elementClassName+"-desc-"+props.confNumber}>{props.children}</div>
      <div>
        {props.ReseteHandler && <div className={props.elementClassName+"-reset"} onClick={props.ReseteHandler.bind(this, props.confNumber, props.index)} />}
      </div>
    </Fragment>)
  } else {
    return ""
  }
}

const SubMenuRightBottom = props => {
  const [isVisible, IsVisibleHandler] = useState(false);

  return(<div
  className={props.elementClassName}
  onMouseEnter={() => IsVisibleHandler(true)}
  onMouseLeave={() => IsVisibleHandler(false)}
>
  <ul className={[props.elementClassName+"-list", props.elementClassName+((isVisible)?"-list--visible":"-list--hiden"), props.elementClassName+"-list-"+props.confNumber].join(" ")}>
    {Object.entries(props.MenuContent).map(([desc, article],i,arr) => <li
      className={!(i===arr.length-1)?props.elementClassName+"-list-li--bordered":null}
      key={article}
      onClick={props.MenuHandler.bind(this, article, props.index)}
    >{desc}</li>)}
  </ul>
</div>)}

const ConfList = props => {
  
  const elementClassName = "conf-main-right-bottom_l1-conf-list";
  const platformСhoiceDesc = props.Configuration.platformСhoiceDesc;

  useEffect(() => {
    const descWidth = document.getElementById(elementClassName+"-desc-"+props.confNumber).offsetWidth;
    const targets =  document.getElementsByClassName(elementClassName+"-specs-menu-list-"+props.confNumber)
    for (let target of targets) {
      target.style.width = descWidth+"px"
    }
  })

  return (
    <div className={elementClassName}>
        {(platformСhoiceDesc.frame_sub_type_article) ? <ConfDescLine
          elementClassName={elementClassName}
          article={platformСhoiceDesc.frame_sub_type_article}
          confNumber={props.confNumber}
        >
          {platformСhoiceDesc.line} ({platformСhoiceDesc.frame_sub_type_desc})
        </ConfDescLine> : null}
        <ConfDescLine
          elementClassName={elementClassName}
          article={platformСhoiceDesc.article}
          ReseteHandler={props.frameResetHandler}
          confNumber={props.confNumber}
        >
          {platformСhoiceDesc.line_desc}
        </ConfDescLine>
        {(platformСhoiceDesc.support_frame_arr) ? platformСhoiceDesc.support_frame_arr.map((frame, index) => <ConfDescLine
          elementClassName={elementClassName}
          article={frame.article}
          confNumber={props.confNumber}
          key={frame+index}
        >
          {props.pricelistinfo[frame.article].description1} {props.pricelistinfo[frame.article].description2 && `(${props.pricelistinfo[frame.article].description2})`}
        </ConfDescLine>) : null}
        {props.Configuration.platformСhoiceDesc.power_sockets_list.map((module, index) => <ConfDescLine
          elementClassName={elementClassName}
          article={module.article}
          confNumber={props.confNumber}
          MenuContent={(module.article_list && Object.values(module.article_list).length>1) && module.article_list}
          MenuHandler={props.powerSocketMenuHandler}
          ReseteHandler={props.powerSocketResetHandler}
          index={index}
          key={module.article+""+index}
        >
          {module.desc}
        </ConfDescLine>)}
        {props.Configuration.Modules.map((module, index) => <ConfDescLine
          confNumber={props.confNumber}
          elementClassName={elementClassName}
          article={module.article}
          display={module.display}
          MenuContent={(module.article_list && Object.values(module.article_list).length>1) && module.article_list}
          MenuHandler={props.ModuleMenuHandler}
          index={index}
          ReseteHandler={props.ModuleResetHandler}
          key={module+index}
        >
          {module.desc}
        </ConfDescLine>)}
    </div>
  );
}

export default ConfContainerRight;