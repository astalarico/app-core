export const dataArrayToSelectOptions = data => {
    return data.map(
        (item) => {
            return {
                label: ( 'name' in item ) ? item.name : `${item.first_name} ${item.last_name}` ,
                value: item.id,
            };
        }
    );
}

export async function fillForm( formUrl ) {
    // const formUrl = mid_database.plugin_url + "/public/assets/buyers-guide.pdf";
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(formPdfBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    fields.forEach((field) => {
        const type = field.constructor.name;
        const name = field.getName();

        if (type === "PDFTextField") {
            field.setText("hi");
        }
        if (type === "PDFCheckBox") {
            field.check();
        }
        if (type === "PDFRadioGroup") {
            const options = field.getOptions();
            console.log( options )
            field.select(options[0]);
 
        }
        console.log(`${type}: ${name}`);


    });
    const pdfBytes = await pdfDoc.save();
    var blob = new Blob([pdfBytes], { type: "application/pdf" });
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "myFileName.pdf";
    link.click()
    return window.URL.createObjectURL(blob);
}