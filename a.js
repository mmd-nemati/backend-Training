
async function run() {
    // open entekhab vahed form
    while (1) {
        let d = document.getElementById('L1');
        d.click()
        await new Promise(r => setTimeout(r, 15000));

        // get form data
        let a = document.getElementsByClassName('TableDataRow');
        let arr = Object.keys(a).map((elem) => {
            return a[elem]
        })
        let old_res = []
        let new_res = []
        // check for changes
        arr.forEach((elem) => {
            let x = (elem.attributes.title)?.textContent
            let y = elem.cells[5].title;
            new_res.push(y + '\n' + x);
            if (JSON.stringify(new_res) !== JSON.stringify(old_res)) {
                console.log('sth changed');
                old_res = new_res;
                new_res = [];
            }

        });

        // close entekhab vahed form
        let c = document.getElementsByClassName('ui-dialog-titlebar-close ui-corner-all');
        c[0].click()
    }
}

run();