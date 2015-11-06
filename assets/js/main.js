$(function(){

	/*********************************
		CODE FOR DEMO PURPOSE ONLY
	**********************************/

		var currencies = ['CAD','CNY','GBP','EUR'],
			currency = 0;

		//SWITCH THE CURRENCY USED ON THE PAGE
		$('.js--toggle-currency').click(function(){
			$('body').removeClass(currencies[currency]);
			
			currency = (currency++ >= currencies.length - 1 )? 0 : currency;
			$('.js--currency').html(" " + currencies[currency]);
			
			$('body').addClass(currencies[currency]);
		}); 

		//TURN OFF FINANCING ON THE PAGE
		$('.js--financing-toggle').click(function(){
			$('body').toggleClass('s-no-financing');
			$('.js--shipping-button').toggleClass('button').toggleClass('button_secondary');
			setTimeout(function(){$('.js--sticky-wrapper').css('height',$('.js--pin-section').css('height'))},100);
		});

		//REMOVE ALL PURCHASES FROM THE PAGE
		$('.js--toggle-purchases').click(function(){
			noItems = !noItems;
			updateTotals();
			$('body').toggleClass('s-no-purchases');
		});


	/*********************************
		INITIALIZE EVERYTHING
	*********************************/
		updatePrices();
		updateTotals();
		updateTotalItems();
		updateTimeStamp();


	/*********************************
		LOGO
	*********************************/

		$('.js--tooltip-logo').tooltipster({
			content: $('<p>Back to rbauction.com</p>'),
			theme: 'ritchie-tooltips',
			delay: 1000,
			hideOnClick: true,
			position: 'bottom'
		});

	/*********************************
		TIMESTAMP
	*********************************/
		//TOOLTIP FOR TIMESTAMP WITH TIME THIS PAGE WAS LAST REFRESHED
		$('.js--tooltip--timestamp').tooltipster({
			content: $('<p>'+ getFormattedDate(startTimeStamp) +'</p>'),
			theme: 'ritchie-tooltips',
			hideOnClick: true,
			position: 'bottom'
		});

		//UPDATE RELATIVE TIME
		var timestampTimer = setInterval(updateTimeStamp, 60000);

		//REFRESH THE PAGE
		$('.js--page-refresh').click(function(){
			location.reload();
		});

	
	/*********************************
		FINANCE CALCULATOR CONTROLS
	*********************************/
		//HANDLE WHEN THE INTEREST RATE CHANGES
		$('.js--finance-interest').on('input', function(){
			if($(this).val().length == 0) return; //don't recalculate if this is empty
			updateInterest(parseFloat($(this).val()).round(2));
		}); 

		//HANDLE TEXT INPUT ON THE INTEREST RATE - ONLY ALLOW NUMBERS AND PERIODS
		$('.js--finance-interest').on('keypress', function(e){
			if (e.keyCode != 46 && e.keyCode > 31 && (e.keyCode < 48 || e.keyCode > 57))
	            return false;
	         return true;
		});

		//HANDLE SCROLLING ON THE INTEREST RATE INPUT
		$('.js--finance-interest').on('blur', function(e){
			$('.js--finance-interest').val(interest.toFixed(2) + "%");
		});

		//HANDLE SCROLLING ON THE INTEREST RATE INPUT
		$('.js--finance-interest')[0].addEventListener('mousewheel', function(e){
			if(parseFloat($(this).val()) < 0) $(this).val(0.00);
		});

		//EVENTS FOR CLICKING +/- ON THE INTEREST RATE INPUT
		$('.js--interest-plus, .js--interest-minus').click(function(){
			
			var tempValue = interest,
				increment = parseFloat($(this).data('increment')).round(2);
			
			if(tempValue + increment <= 0) updateInterest(0);
			else updateInterest(tempValue + increment);
			
			$('.js--finance-interest').val(interest.toFixed(2) + "%");
			
		});

		//HANDLE CHANGING THE FINANCE PERIOD SELECTOR
		$('.js--finance-period').change(function(){
			period = parseInt($(this).val());
			updatePrices();
			updateTotals();
		});

		//TOOLTIP FOR THE FINANCING DISCLAIMER
		$('.js--tooltip_finance-disclaimer').tooltipster({
			content: $($('.js--tooltip_finance-disclaimer--content').html()),
			theme: 'ritchie-tooltips',
			//timer: 10000,
			interactive: true,
			hideOnClick: true,
			position: 'bottom-right'
		});

	/********************************* 
		TOGGLES FOR FINANCING IN EACH ROW
	*********************************/
		//THESE THREE ACTIONS ARE FOR HANDLING MOUSE DOWN ACTIVATION OF TOGGLE
			$('.js--tooltip-monthly-toggle').on('mousedown',function(e){
				var target = $(this).parents('.js--monthly');
				target.toggleClass('s-finance-inactive');
				$(this).find('.js--monthly-toggle').trigger('classChange'); 
				updateTotals();
				updateTotalItems();
			});

			$('.js--monthly-toggle').on('click',function(e){
				e.preventDefault();
				e.stopPropagation();
			});

			$('.js--monthly-toggle').on('classChange',function(){
				
				var target = $(this).parents('.js--monthly');
				$(this).prop('checked',target.hasClass('s-finance-inactive'));
				updateTotals();
				updateTotalItems();
			});

		//TOOLTIPS ON THE MONTHLY FINANCING TOGGLE
		$('.js--tooltip-monthly-toggle').tooltipster({
			content: $($('.js--tooltip-monthly-toggle--content').html()),
			theme: 'ritchie-tooltips',
			delay: 1000,
			timer: 2000,
			hideOnClick: true,
			position: 'bottom-right'
		});

		//ANY NUMBER THAT WE WANT TO ADD COMMAS TO GETS PROCESSED HERE - USED FOR UNIT PRICING ATM
		$('.js--insert-commas').each(function(){
			$(this).html(numberWithCommas($(this).html()));
		});


	/*********************************
		WAYPOINTS - STICKY HEADER
	*********************************/
		var waypoints = new Waypoint({
			element: $('.js--sticky-wrapper'),
			handler: function(direction) {
				$('.js--sticky-wrapper').css('height',$('.js--sticky-wrapper').css('height'));
				
				if(direction === 'down') $('.js--pin-section').addClass('s-stuck');
				else $('.js--pin-section').removeClass('s-stuck');
			}
		});


	/*********************************
		LIGHTBOX INTERACTIONS (APPLICATION PROCESS)
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

		/////// LIGHTBOX ANIMATION STEPS ////////

		$('.js--s1-continue').click(function(){
			$('.js--wizard').removeClass('s-step-1').addClass('s-step-2');
			
			setTimeout(function(){
				$('.js--wizard').removeClass('s-step-2').addClass('s-step-3');
				//CHANGE THE TEXT IN THE "APPLY FOR FINANCING BUTTONS"
				$('.js--lb-show').html('Application Sent!').addClass('s-success');
			},3000);
		});

}); 

$(window).load(function(){
	$('.js--total-price').each(function(){
		checkPriceSize($(this));
	});
});

/*********************************
	GLOBAL VARIABLES
*********************************/

var interest = 6.00,
	period = 24,
	isFinancingHidden = false,
	startTimeStamp = new Date(),
	noItems = false;

/*********************************
	GENERIC FUNCTIONS
*********************************/

Number.prototype.round = function(p) {
  p = p || 10;
  return parseFloat( this.toFixed(p) );
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function pluralize(word, qty){
	return (qty === 1 ? word : word + 's');
}


/*********************************
	UPDATING VALUES FFROM CALCULATIONS
*********************************/

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
	
	if(valString[1]) target.find('.js--cents').html(valString[1].substring(0,2));
	else target.find('.js--cents').html('00');
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

function updateTotalItems(){
	var totalItemsFinance = 0,
		totalItems = 0;

	$('.js--purchase').each(function(){ //COUNT HOW MANY ITEMS ON PAGE AND UPDATE PLACES SHOWING COUNT
		totalItems += 1;
		if($(this).find('.s-finance-inactive').length === 0) totalItemsFinance += 1;
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

	if(noItems){
		totalForFinance = 0;
		totalFinance = 0;
	}

	moneyUpdate($('.js--auction-total'),totalPrice);//UPDATE AUCTION TOTAL

	moneyUpdate($('.js--finance-total'),totalForFinance);//UPDATE TOTAL FOR FINANCING
	
	moneyUpdate($('.js--monthly-total'),totalFinance);//FINANCE MONTHLY PAYMENT TOTAL
}


function checkPriceSize(target){
	//TEXT RESIZE IF TOO WIDE? 

	var totalwidth = target.innerWidth();
		dwidth = parseInt(target.find('.js--dollars').css('width'),10),
		cwidth = parseInt(target.find('.js--cents').css('width'),10),
		fontSize = parseInt(target.find('.js--dollars').css("font-size"));

	while(dwidth + cwidth >= totalwidth){
		fontSize -= 1;
		if(fontSize < 18) return;
		target.find('.js--dollars').css("font-size", fontSize + "px");
		dwidth = parseInt(target.find('.js--dollars').css('width'),10);
	}

	//$('.js--total-price .js--dollars').css("font-size",fontSize + "px");
}

/*********************************
	TIMESTAMP FUNCTIONS
*********************************/

function updateTimeStamp(){
	$('.js--update-time').html(timeDifference(startTimeStamp,Date.now()));
}


function timeDifference(current, previous) {

    var msPerMinute = 60000,
    	msPerHour = msPerMinute * 60,
    	msPerDay = msPerHour * 24,
    	msPerMonth = msPerDay * 30,
    	msPerYear = msPerDay * 365,
    	time;

    var elapsed = Math.abs(current - previous);

    if (elapsed < msPerMinute) {
		return 'right now';
    }

    else if (elapsed < msPerHour) {
         time = Math.round(elapsed/msPerMinute);
         return  time + ' ' + pluralize('minute', time) +' ago';
    }

    else if (elapsed < msPerDay ) {
         time = Math.round(elapsed/msPerHour);
         return  time + ' ' + pluralize('hour', time) +' ago';
    }

    else if (elapsed < msPerMonth) {
        time = Math.round(elapsed/msPerDay);
        return  time + ' ' + pluralize('day', time) +' ago';
    }

    else if (elapsed < msPerYear) {
        time = Math.round(elapsed/msPerMonth);
        return  time + ' ' + pluralize('month', time) +' ago';
    }

    else {
    	time = Math.round(elapsed/msPerYear);
        return 'approximately ' + time + ' ' + pluralize('year', time) + ' ago';   
    }
}


function getFormattedDate(date) {
    date = typeof date !== 'undefined' ?  date : new Date();

    var month = date.getMonth() + 1,
    	day = date.getDate(),
    	hour = date.getHours(),
    	min = date.getMinutes(),
    	sec = date.getSeconds();

    month = (month < 10 ? "0" : "") + month;
    day = (day < 10 ? "0" : "") + day;
    hour = (hour < 10 ? "0" : "") + hour;
    min = (min < 10 ? "0" : "") + min;
    sec = (sec < 10 ? "0" : "") + sec;

    var str = date.getFullYear() + "/" + month + "/" + day + " @ " +  hour + ":" + min + ":" + sec;

    return str;
}




