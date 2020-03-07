import React, {useState, Fragment} from 'react'
import ComponentToPrint from './ConfWindowForPrint';
import ReactToPrint from 'react-to-print';

const FormRow = props => {

    return(
        <Fragment>
            <label>{props.children}:</label>
            <input 
                type="text"
                value={props.value!==undefined ? props.value : props.defaultValue}
                onChange={e => props.handleChange(e, props.label)}
                onFocus={e => e.target.select()}
                className="input-form"
                id={props.id}
            />
        </Fragment>
    )
}

const PrintFormRow = props => {
    const elemntClassName = "print-form"

    const forms_label = {
        "Company": "name",
        "Contact": "customer name",
        "Phone number": "XXXX",
        "E-Mail": "XXXX"
    }

    const [formsData, set_formsData] = useState(forms_label)
    const [errorForms, set_errorForms] = useState(new Set(Object.keys(forms_label)))

    const validateFill = (label, value) => {
        const defaultValue = forms_label[label]
        const target = document.getElementById(label)
        if (value===defaultValue || value==="") {
            target.classList.add(elemntClassName+"-box-form--unValidated")

            const copy_errorForms = new Set(errorForms)
            copy_errorForms.add(label)
            set_errorForms(copy_errorForms)
        } else {
            target.classList.remove(elemntClassName+"-box-form--unValidated")

            const copy_errorForms = new Set(errorForms)
            copy_errorForms.delete(label)
            set_errorForms(copy_errorForms)
        }
    }

    const handleChange = (e, form_label) => {
        const formsData_copy = {...formsData}
        formsData_copy[form_label] = e.target.value
        validateFill(form_label, formsData_copy[form_label])
        set_formsData(formsData_copy)
    }

    const get_cutomerInfo = () => {
        if (errorForms.size===0) {
            return formsData
        } else {
            return null
        }
    }

    return (
        <div className={[elemntClassName, (props.is_form_active ? "" : elemntClassName+"--hidden")].join(" ")}>
            <div className={elemntClassName+"-box"}>
                <h2 className={elemntClassName+"-box-header"}>Customer Info:</h2>
                <form className={elemntClassName+"-box-form"}>
                    {Object.entries(formsData).map(([label, value]) => {
                        return (
                            <FormRow
                                label={label}
                                value={value}
                                defaultValue={forms_label[label]}
                                handleChange={handleChange}
                                key={label}
                                id={label}
                            >{label}</FormRow>
                        )
                    })}
                </form>
                <PrintConfButton get_cutomerInfo={get_cutomerInfo} articlesToPrint_handler={props.articlesToPrint_handler} confNum={props.confNum} className={elemntClassName+"-box-submit"}>Submit</PrintConfButton>
                <button className={elemntClassName+"-box-cancel"} onClick={() => props.printForm_handler(false)}>Cancel</button>
            </div>
        </div>
    )
}

class PrintConfButton extends React.Component {
    state = {articlesToPrint: null, customerInfo: null}
  
    handleBeforeGetContent = () => {
        return new Promise((resolve, reject) => {
            const articlesToPrint = this.props.articlesToPrint_handler(this.props.confNum)
            const customerInfo = this.props.get_cutomerInfo()
            // alert info
            const error_list = []
            if (articlesToPrint === null) {
                error_list.push("Please сomplete the configuration completely.")
            }
            if (customerInfo === null) {
                error_list.push("Please fill Customer info.")
            }

            // setting up new info if all okay
            if (error_list.length === 0) {
                this.setState({articlesToPrint: articlesToPrint, customerInfo: customerInfo}, () => resolve());
            } else {
                const alertMessage = error_list.join("\n")
                alert(alertMessage)
                reject("Conf is not complited!")
                return;
            }
        });
    }
  
    render() {
        return (
            <Fragment>
              <ReactToPrint
                trigger={() => <button className={this.props.className}>{this.props.children}</button>}
                content={() => this.componentRef}
                onBeforeGetContent={this.handleBeforeGetContent}
              />
              <div style={{display: 'none'}}>
                {(this.state.articlesToPrint !== null && this.state.customerInfo !== null) && <ComponentToPrint customerInfo={this.state.customerInfo} configuration={this.state.articlesToPrint} ref={el => (this.componentRef = el)} />}
              </div>
            </Fragment>
        );
    }
  }

export default PrintFormRow;