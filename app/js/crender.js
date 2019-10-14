

for (var item of $("[clone]")){
    var lastItem = item;
    var cloneCount = parseInt(lastItem.attributes.clone.value);
    while(cloneCount>1){
        var clonedItem = $(lastItem).clone()
        clonedItem.insertAfter(lastItem)
        lastItem = clonedItem;
        cloneCount--;
    }
}

//$("[clone]").clone().insertAfter("div.car_well:last");

