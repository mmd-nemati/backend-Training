function setSortOptins(query) {
    let sorts = ['created_at', '-created_at', 'name', '-name', 'age', '-age'];
    let sortParams = query.sort;
    if (!Array.isArray(sortParams)) {
        sortParams = [];
        sortParams.push(query.sort);
    }
    sortParams = sortParams.filter(param => sorts.includes(param));
    let options = sortParams.join(' ');

    return options;
}

function paginate(query) {
    const pageOptions = {
        page: parseInt(query.page, 10) || 1,
        limit: parseInt(query.limit, 10) || 10
    };

    return pageOptions;
}
export { setSortOptins, paginate };