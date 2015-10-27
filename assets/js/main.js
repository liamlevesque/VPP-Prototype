$(function(){

	/*********************************
		INITIALIZE EVERYTHING
	*********************************/
		updatePrices();
		updateTotals();

	
	/*********************************
		FINANCE CALCULATOR CONTROLS
	*********************************/
		$('.js--finance-interest').on('input', function(){
			if($(this).val().length == 0) return; //don't recalculate if this is empty
			updateInterest(parseFloat($(this).val()).round(2));
		});

		$('.js--interest-plus, .js--interest-minus').click(function(){
			
			var tempValue = parseFloat($('.js--finance-interest').val()).round(2), 
				increment = parseFloat($(this).data('increment')).round(2);
			
			if(tempValue + increment <= 0) updateInterest(0);
			else updateInterest(tempValue + increment);
			
			$('.js--finance-interest').val(interest.toFixed(2));
		});

		$('.js--finance-period').change(function(){
			period = parseInt($(this).val());
			
			updatePrices();
			updateTotals();
		});

	/*********************************
		PURCHASE ROWS 
	*********************************/
		$('.js--purchase .js--monthly').click(function(e){
			//$(this).find('.js--monthly-toggle')[0].click();

			//var target = $(this).find('.js--monthly-toggle');
			//$(this).find('.js--monthly-toggle').hide();
			//target.prop('checked',!target.prop('checked'));
			//$(this).toggleClass('s-finance-inactive');
			//updateTotals();
		});

		$('.js--monthly-toggle').on('change',function(){
			$(this).parents('.js--monthly').toggleClass('s-finance-inactive');
			updateTotals();
		});


	/*********************************
		WAYPOINTS
	*********************************/
		var waypoints = new Waypoint.Sticky({
			element: $('.js--pin-section')
		});


	/*********************************
		LIGHTBOX
	*********************************/
		$('.js--lb-show').click(function(){
			$('.js--lightbox').addClass('s-open');
		});

		$('.js--lb-close').click(function(){
			$('.js--lightbox').removeClass('s-open');
		});

		$('.js--collapsible-toggle').click(function(){
			$(this).parents('.js--collapsible').toggleClass('s-expanded');
		});

}); 

Number.prototype.round = function(p) {
  p = p || 10;
  return parseFloat( this.toFixed(p) );
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var interest = 3.95,
	period = 48;

function updateInterest(val){
	if(val < 0) interest = 0;
	else interest = val;
	
	updatePrices();
	updateTotals();
}

function moneyUpdate(target, val){
	target.data('price', val);

	var valString = val.toString().split('.');

	if(valString[1] && valString[1].length < 2) valString[1] += "0";
	
	target.find('.js--dollars').html(numberWithCommas(valString[0]));
	if(valString[1])target.find('.js--cents').html(valString[1].substring(0,2));
}

function updatePrices(){
	$('.js--price').each(function(){
		var thisPrice = $(this),
			amt = $(this).data('price'),
			adjustedInterest = (interest/100)/12,
			monthly = amt * ((adjustedInterest * Math.pow((1 + adjustedInterest),period)) / (Math.pow((1 + adjustedInterest),period) - 1));

		if(adjustedInterest === 0) monthly = amt/period; //IF 0% FINANCING, JUST DIVIDE PRICE BY TOTAL PERIOD

		moneyUpdate(thisPrice,amt);
		moneyUpdate(thisPrice.next('.js--monthly'),monthly);
	}); 
}

function updateTotals(){
 	var totalPrice = 0,
 		totalFinance = 0,
 		totalForFinance = 0;

	$('.js--price').each(function(){
		totalPrice += $(this).data('price');

		//IF THIS ROW IS OFF FOR FINANCING, DON'T ADD TO TOTAL FOR FINANCING
		if(!$(this).next('.js--monthly').hasClass('s-finance-inactive')) totalForFinance += $(this).data('price');
	});


	$('.js--monthly:not(.s-finance-inactive)').each(function(){
		totalFinance += $(this).data('price');
	});

	moneyUpdate($('.js--auction-total'),totalPrice);//UPDATE AUCTION TOTAL

	moneyUpdate($('.js--finance-total'),totalForFinance);//UPDATE TOTAL FOR FINANCING
	
	moneyUpdate($('.js--monthly-total'),totalFinance);//FINANCE MONTHLY PAYMENT TOTAL

}





