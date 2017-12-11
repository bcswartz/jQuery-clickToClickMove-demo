var currentItemId= "";

$(document).ready(function () {
	
	
	$("#addItem").click(function () {
		$("#newItemDiv").removeClass("noShow");
	});

	$("#newItemSave").click(function () {
		//Unbind first
		unbindAll();

		//Send request and perform actions there
		newItemId= ajaxCreateItem($("#newItemBox").val());

	});

	$("#newItemCancel").click(function () {
		$("#newItemDiv").addClass("noShow");
		$("#newItemBox").val("");
	});

	initItems();

});  //end of document ready

function initItems () {

	//Fails on iPod Touch:  $(".itemLi").corner("7px");

	$(".itemLi").each(function(i){
		var itemId= $(this).attr("id");
		var $thisItem = $(".itemDiv").eq(i);

		var $thisItemSpan= $(".itemSpan").eq(i);
		var $thisItemEdit= $(".itemEdit").eq(i);
		var $thisItemCheckbox= $(".itemCheckbox").eq(i);
		var $thisItemBox= $(".itemBox").eq(i);
		var $thisItemUpdate= $(".itemUpdate").eq(i);
		var $thisItemUpdateCancel= $(".itemUpdateCancel").eq(i);

		var $thisControls= $(".controlDiv").eq(i);
		var $thisEdit= $(".editIcon").eq(i);
		var $thisMove= $(".moveIcon").eq(i);

		var $thisDelete= $(".deleteIcon").eq(i);

		$thisItemCheckbox.click(function() {
			if ($thisItemCheckbox.attr("checked"))
				{
					ajaxUpdateChecked(itemId,"Yes");
				}
			else
				{
					ajaxUpdateChecked(itemId,"No");
				}
		});

		$thisItemSpan.toggle(function() {
			$thisControls.removeClass("noShow");
			$thisControls.addClass("controlActive");
		},function () {
			$thisControls.addClass("noShow");
			$thisControls.removeClass("controlActive");
		});

		$thisEdit.click(function () {
			$thisControls.addClass("noShow");
			$thisItemEdit.removeClass("noShow");
			$thisItemSpan.addClass("noShow");
		});

		$thisItemUpdate.click(function() {
			$thisItemSpan.text($thisItemBox.val());
			$thisItemSpan.removeClass("noShow");
			$thisItemEdit.addClass("noShow");
			ajaxUpdateItem(itemId,$thisItemBox.val());
		});

		$thisItemUpdateCancel.click(function() {
			$thisItemBox.val($thisItemSpan.text());
			$thisItemSpan.removeClass("noShow");
			$thisItemEdit.addClass("noShow");
		});

		$thisDelete.click(function() {
			$thisControls.addClass("noShow");
			var answer= confirm("Are you sure you want to delete this item?");
			if (answer)
				{
					$("#" + itemId).remove();
					ajaxDeleteItem(itemId);
				}
		});

		$thisMove.click(function () {
			$thisControls.addClass("noShow");
			currentItemId= $("#" + itemId).attr("id");
			createPositions();
		});
	});

	$(".itemLI > .itemDiv > .itemCheckbox").attr("disabled",false);

} //end of initItems

function createPositions() {

	//Style other items, hide all controlDivs and unbind everything else to start with

	$(".itemLi > itemDiv").addClass("inactive");
	$("#" + currentItemId + "> itemDiv").removeClass("inactive");
	unbindAll();

	var divCount= 1;
	var theList= document.getElementById("mainList");
	$(".itemLi").each(function(i){
		var thisItem= document.getElementById($(this).attr("id"));
		var newDiv= document.createElement("DIV");
		var posId= divCount + "P";
		newDiv.setAttribute("id",posId);
		theList.insertBefore(newDiv,thisItem);
		$("#" + posId).text("Click/tap to put here");
		$("#" + posId).addClass("positionStyle");
		divCount= divCount+1;
	});


	//Add one at the end
	//var lastElementId= $("li:last").attr("id");
	var newDiv= document.createElement("DIV");
	var posId= divCount + "P";
	newDiv.setAttribute("id",posId);
	theList.appendChild(newDiv);
	$("#" + posId).text("Click/tap to put here");
	$("#" + posId).addClass("positionStyle");

	//Now make the positionHolders clickable
	$(".positionStyle").click(function() {
		$(this).text("Moving item...");
		var clonedObj= $("#" + currentItemId).clone(true);
		$("#" + currentItemId).remove();
		clonedObj.insertAfter($(this));
		$(".positionStyle").remove();

		//Run script to preserve order
		ajaxUpdateOrder();

		//Re-enable everything
		initItems();

	});

} //end of function


function unbindAll() {

	$(".itemSpan").unbind();
	$(".controlDiv").unbind();
	$(".editIcon").unbind();
	$(".moveIcon").unbind();
	$(".deleteIcon").unbind();
	$(".itemUpdate").unbind();
	$(".itemUpdateCancel").unbind();
	$(".itemLi > .controlDiv").addClass("noShow");
	$(".itemLI > .itemDiv > .itemCheckbox").attr("disabled",true);
}

function ajaxCreateItem(itemText) {
	$("#waitMsg").removeClass("noShow");
	$.get("actCreateItem.cfm", { i: itemText},
 	 function(data){

		var newItemId= jQuery.trim(data);
		var newClone= $("#templateItem").clone(true);
		newClone.attr("id",newItemId);
		$("#mainList").append(newClone);
		
		//Make sure item is not blank
		if (jQuery.trim($("#newItemBox").val())== "")
			{
				$("#newItemBox").val("{Blank}");
			}
		$("#" + newItemId).addClass("itemLi");
		$("#" + newItemId).removeClass("itemLiT");
		
		$("#" + newItemId + " >  .itemDivT").addClass("itemDiv");
		$("#" + newItemId + " >  .itemDiv > .itemCheckboxT").addClass("itemCheckbox");
		$("#" + newItemId + " >  .itemDiv > .itemSpanT").addClass("itemSpan");
		$("#" + newItemId + " >  .itemDiv > .itemEditT").addClass("itemEdit");
		$("#" + newItemId + " >  .itemDiv > .itemEdit > .itemBoxT").addClass("itemBox");
		$("#" + newItemId + " >  .itemDiv > .itemEdit > .itemUpdateT").addClass("itemUpdate");
		$("#" + newItemId + " >  .itemDiv > .itemEdit > .itemUpdateCancelT").addClass("itemUpdateCancel");
		$("#" + newItemId + " > .controlDivT").addClass("controlDiv");
		$("#" + newItemId + " > .controlDiv > .moveIconT").addClass("moveIcon");
		$("#" + newItemId + " > .controlDiv > .editIconT").addClass("editIcon");
		$("#" + newItemId + " > .controlDiv > .deleteIconT").addClass("deleteIcon");
		
		$("#" + newItemId + " >  .itemDiv > .itemSpan").text($("#newItemBox").val());
		$("#" + newItemId + " >  .itemDiv > .itemCheckbox").val(newItemId);
		//$("#" + newItemId + " >  .itemDiv > .itemBox").text($("#newItemBox").val());
		$("#" + newItemId + " > .itemDiv > .itemEdit > .itemBox").val($("#newItemBox").val());
		//Have to make sure the new item starts off life as unchecked
		$("#" + newItemId + " > .itemDiv > .itemCheckbox").attr("checked",false);
		newClone.removeClass("noShow");

		$("#newItemDiv").addClass("noShow");
		$("#newItemBox").val("");
		$("#waitMsg").addClass("noShow");
		//Rebind
		initItems();

  	});

}  //end of ajaxCreateItem

function ajaxUpdateItem(itemId,itemText) {
	console.log( "Mock REST call to send id and task text to endpoint for update.");

}   //end of ajaxUpdateItem

function ajaxDeleteItem(itemId) {
    console.log( "Mock REST call to send id to endpoint for deletion.");

} //end of ajaxDeleteItem


function ajaxUpdateChecked(itemId,checkVal) {
    console.log( "Mock REST call to send id and checked/unchecked status to endpoint for update.");

} //end of ajaxUpdateChecked


function ajaxUpdateOrder() {
	var itemList= "";
	$(".itemLi").each(function(i){
		if (itemList== "")
			{
				itemList= $(this).attr("id");
			}
		else
			{
				itemList= itemList + "," + $(this).attr("id");
			}
	});
    console.log( "Mock REST call to send id list to endpoint to update order.");

} //end of ajaxUpdateOrder


