(function($){  
	jQuery.fn.addInfoIcons = function(options) {
	 
	 	// Set defaults
  		var defaults = {  
			tooltipwidth: 300, // Max width a info tooltip should be
			space: 15, // Space between center of icon and info tooltip
			stopAfterHover: true, // Should an icon continue remain in the hover state after hover out
			hoverFunction: undefined,
			unhoverFunction: undefined,
			animationDistance: 20, // Distance in pixels info box should fade in and out over
			animationLength: 300, // Length in miliseconds default animation should take
			animateIconFunction: addInfoIconsAnimate // Function that should be called when animation starts
		};
  		var options = jQuery.extend(defaults, options);
  		
  		// Set the function
		return this.each(function() {
			
			// Target element
			var block = jQuery(this);
			
			// Setup block css properties
			block.css({
				position: "relative",
				left: "0px",
				right: "0px"
			});
			
			// Setup points
			block.find("li").each(function(i){
				
				// Get values
				var left = parseInt(jQuery(this).attr("data-x")) - options.space;
				var top	 = parseInt(jQuery(this).attr("data-y")) - options.space;
				var text = jQuery(this).html();
				var id = jQuery(this).attr("id")===undefined?"addInfoIcons-point"+i:jQuery(this).attr("id");
				var info_id = "addInfoIcons-info"+i;
				
				// Create point, transfer attributes to div and then set positon
				block.append("<div class='addInfoIcons-point' id='"+id+"' />");
				$.each(this.attributes, function(i, attrib){
					$("#"+id).attr(attrib.name, attrib.value);
				});
				$("#"+id).css({left: left, top: top});
				
				// Create info tooltip
				block.append("<div class='addInfoIcons-info' id='"+info_id+"' />");
				$("#"+info_id)
					.attr("data-for", id)
					.html(text)
					.css({
						maxWidth: options.tooltipwidth,
						left: left+35,
						top: top
					});
				
				// Remove <li>
				jQuery(this).remove();
				
				// Adjust position of tooltip if off screen
				var info = jQuery("#"+info_id);
				var max_width = jQuery(window).width()-5;
				var width = info.width() + info.offset().left;
				if (width > max_width) {
					//var offset = width-max_width;
					if (info.height()>20) {
						info.css("width", options.tooltipwidth);
					}
					info.css("left", left-info.width()-options.space);
				}
				
			});
			// Remove list elements
			jQuery("ul, ol").remove();
			
			// Add hover function to bring up tooltips to points
			block.find(".addInfoIcons-point").hover(
				options.hoverFunction!=undefined?options.hoverFunction:function(){
					
					// Get elements
					var info = ".addInfoIcons-info[data-for='"+jQuery(this).attr('id')+"']";
					var top = block.find(info).attr("top");
					
					// Add stop class 
					jQuery(this)
						.addClass("addInfoIcons-hover")
						.css("background-position-x", "0px")
						.css("background-position-y", "-30px");
					
					// Animate tooltip fade in
					block.find(info).css("top", parseInt(top)+parseInt(options.animationDistance)).css("z-index", "1");
					block.find(info).animate(
						{opacity:1, top: top},
						options.animationLength,
						"linear",
						function(){block.find(info).css("z-index", "1");}
					);
				}
				,options.unhoverFunction!=undefined?options.unhoverFunction:function(){
					
					// Get elements
					var info = ".addInfoIcons-info[data-for='"+jQuery(this).attr('id')+"']";
					var top = block.find(info).attr("top");
					
					// If option stopAfterHover set to false, remove hover class
					if (!options.stopAfterHover) {
						jQuery(this).removeClass("addInfoIcons-hover");
					}
					
					// Setup style
					jQuery(this).css("background-position-x", "0px").css("background-position-y", "0px");
					
					// Animate tooltip fade out
					block.find(info).animate(
						{opacity:0, top: parseInt(top)-parseInt(options.animationDistance)},
						options.animationLength,
						"linear",
						function(){block.find(info).css("z-index", "auto");}
					);
					
				}
			);
			
			// Add animation function to points
			options.animateIconFunction(block);
			
		});  
		
	};	 
})(jQuery);

// This function animates the pulse of the info icons
function addInfoIconsAnimate(block) {
	block = jQuery(block);
	if (block.attr("id") === undefined) {
		block.attr("id") = "addInfoIconsBlock"+(Math.random()*1000000000000+(+new Date));
	}
	var points = block.find(".addInfoIcons-point:not(.addInfoIcons-hover)");
	var frame = parseInt(points.css("background-position-x"))/30-1;
	var time = 50;
	if (frame < -9) {
		frame = 0;
		time += 450;
	}	
	points.css("background-position-x", frame*30+"px");
	setTimeout("addInfoIconsAnimate('#"+block.attr("id")+"');",time);
}
	