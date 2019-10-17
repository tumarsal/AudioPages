document.addEventListener("DOMContentLoaded", function() {

});
function toggleId(id,cl){
	let element = document.getElementById(id);
	toggle(element,cl)
}
function toggle(element,cl){
	
	if(element!=null){
	
		console.log(element.id+" - "+element.classList.contains(cl))
		element.classList.toggle(cl)
	}
}
function menuToggle(){
	toggleId('side-menu','open');
}

function openModal(id){
	toggleId(id,'open');
}