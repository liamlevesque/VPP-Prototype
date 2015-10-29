$(function(){

	/*********************************
		CODE FOR DEMO PURPOSE ONLY
	**********************************/

		var currencies = ['dollar','yen','pound','euro'],
			currency = 0;

		$('.js--toggle-currency').click(function(){
			$('body').removeClass(currencies[currency]);
			
			currency = (currency++ >= currencies.length - 1 )? 0 : currency;
			
			$('body').addClass(currencies[currency]);
		}); 

	/*********************************
		INITIALIZE EVERYTHING
	*********************************/
		updatePrices();
		updateTotals();
		updateTotalItems();
	
	/*********************************
		FINANCE CALCULATOR CONTROLS
	*********************************/
		$('.js--finance-interest').on('input', function(){
			if($(this).val().length == 0) return; //don't recalculate if this is empty
			updateInterest(parseFloat($(this).val()).round(2));
		});

		$('.js--finance-interest').on('keypress', function(e){
			if (e.keyCode != 46 && e.keyCode > 31 && (e.keyCode < 48 || e.keyCode > 57))
	            return false;
	         return true;
		});

		$('.js--finance-interest').on('blur', function(e){
			$('.js--finance-interest').val(interest.toFixed(2) + "%");
		});

		$('.js--finance-interest')[0].addEventListener('mousewheel', function(e){
			if(parseFloat($(this).val()) < 0) $(this).val(0.00);
		});

		$('.js--interest-plus, .js--interest-minus').click(function(){
			
			var tempValue = interest,
				increment = parseFloat($(this).data('increment')).round(2);
			
			if(tempValue + increment <= 0) updateInterest(0);
			else updateInterest(tempValue + increment);
			
			$('.js--finance-interest').val(interest.toFixed(2) + "%");
			
		});

		$('.js--finance-period').change(function(){
			period = parseInt($(this).val());
			
			updatePrices();
			updateTotals();
		});

		// $('.js--toggle-finance').click(function(){
		// 	if(isFinancingHidden) return;
		// 	isFinancingHidden = true;
				
		// 	var currentHeight = parseInt($('.js--sticky-wrapper').css('height')),
		// 		financeHeight = parseInt($('.js--finance-container').css('height'));

		// 	$('.js--sticky-wrapper').css('height',currentHeight - financeHeight + 'px');

		// 	$('.js--finance-container').addClass('s-hidden');
		// });

	/********************************* 
		PURCHASE ROWS 
	*********************************/
		$('.js--monthly-toggle').on('change',function(){
			$(this).parents('.js--monthly').toggleClass('s-finance-inactive');
			updateTotals();
		});

		//ANY NUMBER THAT WE WANT TO ADD COMMAS TO GETS PROCESSED HERE - USED FOR UNIT PRICING ATM
		$('.js--insert-commas').each(function(){
			$(this).html(numberWithCommas($(this).html()));
		});


	/*********************************
		WAYPOINTS
	*********************************/
		var waypoints = new Waypoint({
			element: $('.js--sticky-wrapper'),
			handler: function(direction) {
				$('.js--sticky-wrapper').css('height',$('.js--sticky-wrapper').css('height'));
				// var currentHeight = parseInt($('.js--sticky-wrapper').css('height')),
				// 	financeHeight = parseInt($('.js--finance-container').css('height'));
				
				if(direction === 'down'){
					$('.js--pin-section').addClass('s-stuck');
					// if(isFinancingHidden) $('.js--sticky-wrapper').css('height',currentHeight - financeHeight + 'px');
					// else $('.js--sticky-wrapper').css('height',currentHeight + 'px');
				}
				else{
					$('.js--pin-section').removeClass('s-stuck');
					//if(isFinancingHidden) $('.js--sticky-wrapper').css('height',currentHeight + financeHeight + 'px');
				}
			}
		});


	/*********************************
		LIGHTBOX
	*********************************/
		$('.js--lb-show').click(function(){
			$('.js--lightbox').addClass('s-open');
			$('.js--body').addClass('s-no-scroll');
		});

		$('.js--lb-close').click(function(){
			$('.js--lightbox').removeClass('s-open');
			$('.js--body').removeClass('s-no-scroll');
		});

		$('.js--collapsible-toggle').click(function(){
			$(this).parents('.js--collapsible').toggleClass('s-expanded');
		});

		$('.js--lb-window').click(function(e){
			e.stopPropagation(); //PREVENT ACTIONS IN THE MODAL FROM TRIGGERING THE CLOSE BEHAVIOUR
		});

		/////// WIZARD ////////

		$('.js--s1-continue').click(function(){
			$('.js--wizard').removeClass('s-step-1').addClass('s-step-2');
			
			setTimeout(function(){
				$('.js--wizard').removeClass('s-step-2').addClass('s-step-3');	
			},3000);
			
			// var currentStep = $('.js--wizard-step.s-active').data('step'),
			// 	nextStep = currentStep + 1;
			
			// $('.js--wizard-step.s-active').addClass('s-complete').removeClass('s-active');
			// $('.js--wizard-step[data-step="' + nextStep + '"]').addClass('s-active');
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
	period = 48,
	isFinancingHidden = false;

// function resizeStickySection(hideOrNot){
// 	var currentHeight = parseInt($('.js--sticky-wrapper').css('height')),
// 		financeHeight = parseInt($('.js--finance-container').css('height'));

// 	//if(hideOrNot) $('.js--sticky-wrapper').css('height',currentHeight - financeHeight + 'px');
// 	 $('.js--sticky-wrapper').css('height',currentHeight - financeHeight + 'px');
// }

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

function pluralize(word, qty){
	if(qty > 1) return word + 's';
	else return word;
}

function updateTotalItems(){
	var totalItemsFinance = 0,
		totalItems = 0;

	$('.js--purchase').each(function(){ //COUNT HOW MANY ITEMS ON PAGE AND UPDATE PLACES SHOWING COUNT
		totalItems += 1;
		if(!$(this).hasClass('s-finance-inactive')) totalItemsFinance += 1;
	});
	
	$('.js--total-items').html(totalItems + " " + pluralize('item',totalItems));
	$('.js--total-items_finance').html(totalItemsFinance + " " + pluralize('item',totalItemsFinance));
	
}

function updateTotals(){
 	var totalPrice = 0,
 		totalFinance = 0,
 		totalForFinance = 0;

	$('.js--price').each(function(){
		totalPrice += $(this).data('price');

		//IF THIS ROW IS OFF FOR FINANCING, DON'T ADD TO TOTAL FOR FINANCING
		if(!$(this).next('.js--monthly').hasClass('s-finance-inactive')){
			totalForFinance += $(this).data('price');
		} 

	});

	$('.js--monthly:not(.s-finance-inactive)').each(function(){
		totalFinance += $(this).data('price');
	});

	moneyUpdate($('.js--auction-total'),totalPrice);//UPDATE AUCTION TOTAL

	moneyUpdate($('.js--finance-total'),totalForFinance);//UPDATE TOTAL FOR FINANCING
	
	moneyUpdate($('.js--monthly-total'),totalFinance);//FINANCE MONTHLY PAYMENT TOTAL

}





