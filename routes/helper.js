import { forEach } from "underscore";

function setSortOptins(queryParams) {
    let sorts = ['created_at', '-created_at', 'name', '-name', 'age', '-age'];
    let sortParams = queryParams.sort;
    if(!Array.isArray(sortParams)) {
        sortParams = [];
        sortParams.push(queryParams.sort);
    }
    sortParams = sortParams.filter(param => sorts.includes(param));
    let options = sortParams.join(' ');

    return options;
}

export { setSortOptins };