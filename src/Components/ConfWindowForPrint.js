import React, { Component, Fragment } from 'react';
import priceList from '../Data/pricelistinfo';

class ComponentToPrint extends Component {

    className = "component-to-print"

    headers = ["Pos.", "Item Nr.", "Decription", "Quantity"]

    firstColumnCI = [
        <Fragment><span>ECCO</span> CINE SUPPLY AND SERVICE GMBH</Fragment>,
        "Marie-Curie-Str. 20 • D - 40721 Hilden",
        "Telefon: +49(0)211/522875-0",
        "Telefax: +49(0)211/522875-10",
        "E-Mail: office@ecco-online.eu",
        "Internet: www.ecco-online.eu",
    ]

    secondColumnCI = [
        "DE Steuer-Nr.:", "103/5724/2402",
        "DE USt-ID:", "DE 281834860",
        "HRG 67133:", "Düsseldorf",
        "Geschäftsführer:", <Fragment>Thomas Rüttgers<br/>Horst Kleinpeter</Fragment>,
    ]
    
    thirdColumnCI = [
        "Sparkasse Düsseldorf", <Fragment>SWIFT/BIC: DUSSDEDDXXX<br/>IBAN: DE87 3005 01101007 3139 66</Fragment>,
        "Kreissparkasse Düsseldorf", <Fragment>SWIFT/BIC: WELADED1KSD<br/>IBAN: DE55 3015 0200 00021361 41</Fragment>,
        "Deutsche Ban", <Fragment>SWIFT/BIC: DEUTDEDBDUE<br/>IBAN: DE17 3007 0024 0533 6565 00</Fragment>,
    ]

    lack_module = {
        Type: "Some module",
        Description1: "An error on",
        Description2: "loading from price list"
    }

    currentDate = () => {
        const today = new Date();
        const date = today.getDate()+'.'+(today.getMonth()+1)+'.'+today.getFullYear();
        return date
    }

    render () {
        return (
            <div className={this.className}>
                <table>
                    <tbody><tr><td>
                        <div className={this.className+"-content"}>
                            <img 
                                className={this.className+"-content-logo"} 
                                src="https://www.tls-electronics.de/custom/tls_electro/img/top_left_logo.png" 
                                alt="logo"
                            />
                            <div className={this.className+"-content-customerInfo"}>
                                <p className={this.className+"-content-customerInfo-tlsContact"}><span>ECCO GMBH</span><span>&#183;</span>Marie-Curie-Straße 20<span>&#183;</span>D-40721 Hilden</p>
                                <p className={this.className+"-content-customerInfo-header"}>INQUIRY</p>
                                <p className={this.className+"-content-customerInfo-companyName"}>{this.props.customerInfo["Company"]}</p>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>Date</td><td>: {this.currentDate()}</td>
                                        </tr>
                                        <tr>
                                            <td>Contact</td><td>: {this.props.customerInfo["Contact"]}</td>
                                        </tr>
                                        <tr>
                                            <td>Phone</td><td>: {this.props.customerInfo["Phone number"]}</td>
                                        </tr>
                                        <tr>
                                            <td>E-Mail</td><td>: {this.props.customerInfo["E-Mail"]}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className={this.className+"-content-configuration"}>
                                {this.headers.map(header => {
                                    return (
                                        <p key={header} className={this.className+"-content-configuration-header"}>{header}</p>
                                    )
                                })}
                                {this.props.configuration.map((obj, i) => {
                                    const [article, posList] = Object.values(obj)
                                    const module = (priceList[article]) ? priceList[article] : this.lack_module
                                    return (
                                        <Fragment key={article+"_"+i}>
                                            <p>{posList.map(pos => pos+1).join(", ")}</p>
                                            <p>{article}</p>
                                            <p className={this.className+"-content-configuration-desc"}>{module["type"]}:<br/></p>
                                            <p className={this.className+"-content-configuration-desc"}>{module["description1"]}<br/>{module["description2"]}</p>
                                            <p>{posList.length}</p>
                                        </Fragment>
                                    )
                                })}
                            </div>
                        </div>
                    </td></tr></tbody>
                    <tfoot><tr><td><div className="footer-height">&nbsp;</div></td></tr></tfoot>
                </table>
                <div className={this.className+"-footer"}>
                    <div className={this.className+"-footer-col1"}>
                        {this.firstColumnCI.map((text, i) => {
                            return (
                                <p key={"firstColumnCI_"+i}>{text}</p>
                            )
                        })}
                    </div>
                    <div className={this.className+"-footer-col2-3"}>
                        {this.secondColumnCI.map((text, i) => {
                            return (
                                <p key={"secondColumnCI_"+i}>{text}</p>
                            )
                        })}
                    </div>
                    <div className={this.className+"-footer-col2-3"}>
                        {this.thirdColumnCI.map((text, i) => {
                            return (
                                <p key={"thirdColumnCI_"+i}>{text}</p>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}


export default ComponentToPrint;