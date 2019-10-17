for (var item of $("[clone]")) {
    var lastItem = item;
    console.log('found cloneItem' + lastItem.id)
    var cloneCount = parseInt(lastItem.attributes.clone.value);
    while (cloneCount > 1) {
        var clonedItem = $(lastItem).clone()
        clonedItem.insertAfter(lastItem)
        lastItem = clonedItem;
        cloneCount--;
    }
}
console.log('crender')