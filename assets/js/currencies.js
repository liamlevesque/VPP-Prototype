$(function(){

	updateMoney();

	$('.js--ccy-select').change(function(){
		$('#js--body').removeClass().addClass($(this).val());
		updateMoney();
	});

});

function divideNumber(x) {
	//ASSUMES THE PRICE COMES IN FORMAT 000000.00
    var price = x.split('.');
    
    //MAJOR COMPONENT (ie Dollars) - split up into chunks with dividers where commas or spaces would go.
    	//IF THIS IS INDIAN RUPEES, DIVIDE INTO LAKH, CRORE... (THIS IS THE ONLY EXCEPTION TO THE RULE OF WHERE TO PLACE COMMAS)
    if($('#js--body').hasClass('INR')) price[0] = price[0].toString().replace(/(\d)(?=(\d\d)+\d$)/g, '$1<span class="divider"></span>');
    	//ELSE DIVIDE INTO CHUNKS OF 3 CHARACTERS SEPARATED BY DIVIDERS
    else price[0] = price[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, '<span class="divider"></span>');
    
    //MINOR COMPONENT (ie Cents)
    	//NOTE - DO WHAT YOU'D LIKE HERE TO ROUND/TRUNCATE CENTS IF NEEDED
    price[1] = price[1].substr(0,2);

    return price;
}

function updateMoney(){
	var amount = divideNumber($('.js--target-price').data('amt'));
	$('.js--target-price .js--dollars').html(amount[0]);
	$('.js--target-price .js--cents').html(amount[1]);
}
