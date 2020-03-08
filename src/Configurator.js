import React, { Component } from 'react';
import ConfContainerLeft from './Components/ConfContainerLeft';
import ConfContainerRight from './Components/ConfContainerRight';
import PrintForm from './Components/PrintForm'

//Data
import {supportFrames, subModulesType, framesForTopMenu, modulesForBottomMenu, PowerSocket} from './Data/data';
import localStrings from './Data/strings';
import priceList from './Data/pricelistinfo';

//CSS
import './Style/configurator.css';

class Configurator extends Component {
  
  state = {
    Language: 'en',
    QuantityOfConf: 1,
    ConfNumber: 0,
    Configurations: Array(1).fill({}),
    maxConfQuantity: 3,
    is_form_active: false,
    resetConfOnChange: false
  };

  deep_ConfigurationsCopy = () => JSON.parse(JSON.stringify(this.state.Configurations));

  platformHandler = (frameInf, location, line) => {
    const inf = {...frameInf, location : location, line : line};
    if (inf.location==="TABLE") {
      // img for right top menu
      inf.img = "img/" + inf.location.toLowerCase() + "/" + inf.line.toLowerCase() + "/"+ inf.line.toLowerCase() + "img.png";
      // right top menu
      inf.frame_sub_type = subModulesType[inf.location][inf.line];
      inf.frame_sub_type_desc = Object.keys(inf.frame_sub_type)[0];
      inf.frame_sub_type_article = inf.frame_sub_type[inf.frame_sub_type_desc];
    } else if (inf.location==="WALL") {
      // fill support frames
      const support_frame_line = line.match(/[A-Z]{1,}$/)[0]
      inf.support_frame_arr = Array(inf["support-frame_amount"]).fill(supportFrames[support_frame_line][0])
      inf.isCoverHiden = true;
      //all signall slots
      let qunatity_of_signal_slots = 0
      for (const supp_frame of inf.support_frame_arr) {
        qunatity_of_signal_slots+=supp_frame["frame-width"]
      }
      inf["signal-slots"] = qunatity_of_signal_slots
    }
    inf.line_desc = priceList[frameInf.article].description1;
    inf.frame_desc = priceList[frameInf.article].description2;
    if (inf["power-sockets"] > 0) {
      inf.powerSocketList = PowerSocket.reduce((obj, article) => (priceList[article] ? {...obj, [priceList[article].description1]: article} : obj), {});
      inf.powerSocketDesc = Object.keys(inf.powerSocketList)[0]
      inf.powerSocketArticle = inf.powerSocketList[inf.powerSocketDesc];
    }
    inf.empty_module = {
      img: "img/layout-parts/empty-signal-slot-" + (line==="Universal Line WP" ? "wp" : "ipl") + ".png",
      display: true,
    }
    const copyOfConfs=this.deep_ConfigurationsCopy();
    copyOfConfs[this.state.ConfNumber] = {}
    copyOfConfs[this.state.ConfNumber].platformСhoiceDesc = inf;
    copyOfConfs[this.state.ConfNumber].Modules = Array(inf["signal-slots"]).fill(inf.empty_module);

    this.setState({Configurations: copyOfConfs});
  }

  setModule = (module_inf, module_series, module_type, index, support_frame_index) => {
    const copyOfConfs = this.deep_ConfigurationsCopy();
    const modulesList = copyOfConfs[this.state.ConfNumber].Modules;
    module_inf.module_series = module_series
    module_inf.module_type = module_type

    const moduleData_priceList = priceList[module_inf.article]
    if (moduleData_priceList) {
      module_inf.desc = moduleData_priceList.description1 + (
        moduleData_priceList.description2 && `(${moduleData_priceList.description2})`
      )
    }

    //Module weight

    const getWeight = article => {
      if (module_inf.module_type === "Power Sockets") {
        return 3
      } else if (priceList[article]) {
        const slotsWidth_rexEx = /[0-9] slots* width/
        const module_module_info = Object.values(priceList[article])
        const slots_takes = module_module_info.map(str => str.match(slotsWidth_rexEx) && str.match(slotsWidth_rexEx)[0]).filter(Boolean)[0]
        return slots_takes && parseInt(slots_takes.replace(/\D+/, ""))
      } else {
        alert(article+ " - is not exist in price Table!")
        return 1
      }
    }

    if (module_inf.article_list && module_inf.slots_takes===undefined) {
      for (const article of Object.values(module_inf.article_list)) {
        if (!module_inf.slots_takes) {
          module_inf.slots_takes = getWeight(article);
        } else {
          break;
        }
      }
    } else if (module_inf.slots_takes===undefined) {
      module_inf.slots_takes = getWeight(module_inf.article)
    }
    //post check is slots weight was found
    if (module_inf.slots_takes===undefined) {
      alert(`Error, module-${module_inf.article} cant be found in table, write to us!`);
      return;
    }

    const platformСhoiceDesc = copyOfConfs[this.state.ConfNumber].platformСhoiceDesc
    if (platformСhoiceDesc.location==="WALL") {
      const indexInChunk = index - platformСhoiceDesc.support_frame_arr.slice(0, support_frame_index).reduce((sum, supp_frame) => sum+=supp_frame["frame-width"], 0)
      if (indexInChunk+module_inf.slots_takes>platformСhoiceDesc.support_frame_arr[support_frame_index]["frame-width"]) {
        return null
      };

      module_inf.support_frame_index = support_frame_index

      const support_frame_line = module_inf.module_series.match(/[A-Z]{1,}$/)[0]
      for (const supp_frame of supportFrames[support_frame_line]) {
        if (supp_frame["support-modules-type"].includes(module_inf.module_type)) {
          platformСhoiceDesc.support_frame_arr[module_inf.support_frame_index] = supp_frame;
          break;
        }
        continue;
      }
    } else if (platformСhoiceDesc.location==="TABLE") {
      if (modulesList[index+(module_inf.slots_takes-1)]===undefined) {
        return null
      };
    }

    for (let i = 1; i<modulesList[index].slots_takes; i++) {
      modulesList[index+i].display = true;
    }
    for (let i = 1; i<module_inf.slots_takes; i++) {
      const test = modulesList[index+i].slots_takes;
      for (let j = 1;j<test; j++) {
        modulesList[index+i+j].display=true;
      }
      modulesList[index+i] = {...platformСhoiceDesc.empty_module, display: false};
    }
    
    modulesList[index] = {...platformСhoiceDesc.empty_module, ...module_inf};

    this.setState({Configurations: copyOfConfs})
  }

  confNumberHandler = (number) => {
    this.setState({ConfNumber: number})
  }

  addConfHandler = () => {
    if (this.state.QuantityOfConf >= this.state.maxConfQuantity) return;
    const copyOfConfs = this.state.Configurations.slice();
    copyOfConfs.push({});
    this.setState({QuantityOfConf: this.state.QuantityOfConf+1, Configurations: copyOfConfs});
  }

  moduleMenuHandler = (article, index) => {
    const copyOfConfs=this.deep_ConfigurationsCopy();
    const desc = priceList[article].description1 + (priceList[article].description2 && `(${priceList[article].description2})`)
    const newInf={
      article: article,
      desc: desc,
    }
    copyOfConfs[this.state.ConfNumber].Modules[index] = {
      ...copyOfConfs[this.state.ConfNumber].Modules[index],
      ...newInf
    }
    this.setState({Configurations: copyOfConfs})
  }

  frame_sub_typeHandler = (newSubInf) => {
    const copyOfConfs=this.deep_ConfigurationsCopy();
    copyOfConfs[this.state.ConfNumber].platformСhoiceDesc = {...this.state.Configurations[this.state.ConfNumber].platformСhoiceDesc, ...newSubInf};
    this.setState({Configurations: copyOfConfs});
  }

  moduleResetHandler = (confNumber, indexOfSlot) => {
    const copyOfConfs=this.deep_ConfigurationsCopy();

    // Reset support frame in whick module was installed
    if (copyOfConfs[this.state.ConfNumber].platformСhoiceDesc.support_frame_arr !== undefined) {
      const support_frame_index = copyOfConfs[this.state.ConfNumber].Modules[indexOfSlot].support_frame_index
      const support_frame_line = copyOfConfs[this.state.ConfNumber].platformСhoiceDesc.line.match(/[A-Z]{1,}$/)[0]
      copyOfConfs[this.state.ConfNumber].platformСhoiceDesc.support_frame_arr[support_frame_index] = supportFrames[support_frame_line][0]
    };

    for (let i = 1; i<copyOfConfs[confNumber].Modules[indexOfSlot].slots_takes; i++) {
      copyOfConfs[confNumber].Modules[indexOfSlot+i] = copyOfConfs[confNumber].platformСhoiceDesc.empty_module;
    }

    copyOfConfs[this.state.ConfNumber].Modules[indexOfSlot] = copyOfConfs[confNumber].platformСhoiceDesc.empty_module;

    this.setState({Configurations: copyOfConfs})
  }

  frameResetHandler = (indexOfConf) => {
    const copyOfConfs=this.deep_ConfigurationsCopy();
    if (indexOfConf !== undefined) {
      const isConfirmed = window.confirm("This will erase the whole Configuration, are you sure?")
      if (isConfirmed) {
        copyOfConfs[indexOfConf] = {};
      }
    } else {
      indexOfConf = this.state.ConfNumber;
      copyOfConfs[indexOfConf] = {};
    }
    this.setState({Configurations: copyOfConfs});
  }

  coverHidenHandler = () => {
    const copyOfConfs=this.deep_ConfigurationsCopy();
    copyOfConfs[this.state.ConfNumber].platformСhoiceDesc.isCoverHiden = !copyOfConfs[this.state.ConfNumber].platformСhoiceDesc.isCoverHiden;
    this.setState({Configurations: copyOfConfs});
  }

  powerSocketMenuHandler = (article) => {
    const desc = priceList[article].description1
    const newInf = {
      powerSocketDesc: desc,
      powerSocketArticle: article
    }
    const copyOfConfs=this.deep_ConfigurationsCopy()
    copyOfConfs[this.state.ConfNumber].platformСhoiceDesc = {
      ...copyOfConfs[this.state.ConfNumber].platformСhoiceDesc,
      ...newInf,
    }
    this.setState({Configurations: copyOfConfs})
  }

  articlesToPrint_handler = (confNum) => {
    const configuration = this.state.Configurations[confNum]
    if (configuration.platformСhoiceDesc === undefined) {
      return null
    }
    let article_list = [];
    configuration.platformСhoiceDesc.article && article_list.push(configuration.platformСhoiceDesc.article.toString());

    configuration.platformСhoiceDesc.frame_sub_type_article && article_list.push(configuration.platformСhoiceDesc.frame_sub_type_article.toString());

    const suppFrame_articles = []
    if (configuration.platformСhoiceDesc.support_frame_arr) {
      for (const supp_frame of configuration.platformСhoiceDesc.support_frame_arr) {
        suppFrame_articles.push(supp_frame.article.toString());
      }
    }

    const modules_articles = []
    if (configuration.Modules) {
      for (const module of configuration.Modules) {
        if (module.display===true) {
          modules_articles.push(module.article ? module.article.toString() : null);    
        }
      }
    }

    const powerSocket_articles = []
    if (configuration.platformСhoiceDesc["power-sockets"]) {
      for (let i=0; i<configuration.platformСhoiceDesc["power-sockets"]; i++) {
        powerSocket_articles.push(configuration.platformСhoiceDesc.powerSocketArticle.toString());
      }
    }

    let pos;
    if (powerSocket_articles.length > 2) {
        pos = 2;
    } else if (configuration.platformСhoiceDesc["conference-control"] || configuration.platformСhoiceDesc["conference-control-double-frame"] || configuration.platformСhoiceDesc["location"]!=="TABLE") {
        pos = 0;
    } else {
        pos = 1;
    }
    // Add modules to PS array
    powerSocket_articles.splice(pos, 0, ...modules_articles)

    // Add modules, ps, suppframes to main printing arr
    article_list = [...article_list, ...suppFrame_articles, ...powerSocket_articles]

    const outPut = [];
    for (let i=0; i<article_list.length; i++) {
      const article = article_list[i];
      if (article===null) {
        return null;
      }
      let is_dup = false;
      for (let j=0; j<outPut.length; j++) {
        const curr_article = outPut[j].article
        if (curr_article === article) {
          is_dup = true;
          outPut[j].pos.push(i);
        }
      }
      if (is_dup===false) {
        outPut.push({article: article, pos: [i]});
      }
    };
    return outPut;
  }

  printForm_handler = (is_form_active, confNum=this.state.right_ConfNumber) => {
    this.setState({is_form_active: is_form_active, right_ConfNumber: confNum})
  }

  render() {
    return (
      <div className={"conf-main "+(this.state.is_form_active ? "conf-main-form-active" : "")}>
        <ConfContainerLeft 
          localStrings={localStrings}
          framesForTopMenu={framesForTopMenu}
          modulesForBottomMenu={modulesForBottomMenu}
          Language={this.state.Language}
          QuantityOfConf={this.state.QuantityOfConf}
          Configuration={this.state.Configurations[this.state.ConfNumber]}
          resetConfOnChange={this.state.resetConfOnChange}
          //Handlers
          setModule={this.setModule}
          CoverHidenHandler={this.coverHidenHandler}
          platformHandler={this.platformHandler}
          ConfNumberHandler={this.confNumberHandler}
          AddConfHandler={this.addConfHandler}
          maxConfQuantity={this.state.maxConfQuantity}
          frameResetHandler={this.frameResetHandler}
        />
        <ConfContainerRight
          ConfNumber={this.state.ConfNumber}
          Configurations={this.state.Configurations}
          QuantityOfConf={this.state.QuantityOfConf}
          //Handlers
          ModuleMenuHandler={this.moduleMenuHandler}
          frame_sub_typeHandler={this.frame_sub_typeHandler}
          ModuleResetHandler={this.moduleResetHandler}
          frameResetHandler={this.frameResetHandler}
          powerSocketMenuHandler={this.powerSocketMenuHandler}
          printForm_handler={this.printForm_handler}
        />
        <PrintForm confNum={this.state.right_ConfNumber} articlesToPrint_handler={this.articlesToPrint_handler} is_form_active={this.state.is_form_active} printForm_handler={this.printForm_handler} />
      </div>
    );
  }
}

export default Configurator;
