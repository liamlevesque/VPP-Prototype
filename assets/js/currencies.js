$(function(){

	updateMoney();

	$('.js--ccy-select').change(function(){
		$('#js--body').removeClass().addClass($(this).val());
		updateMoney();
	});

});

function divideNumber(x) {
    var price = x.split('.');
    if($('#js--body').hasClass('INR')) price[0] = price[0].toString().replace(/(\d)(?=(\d\d)+\d$)/g, '$1<span class="divider"></span>');
    else price[0] = price[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, '<span class="divider"></span>');
    return price;
}

function updateMoney(){
	var amount = divideNumber($('.js--target-price').data('amt'));
	$('.js--target-price .js--dollars').html(amount[0]);
	$('.js--target-price .js--cents').html(amount[1]);
}
