#pragma strict

@script AddComponentMenu ("OpenGUI/Slider")

enum SliderType {
	Horizontal,
	Vertical
}

class OGSlider extends OGWidget {
	var sliderType : SliderType;
	var sliderValue : float = 1.0;
	var min : float = 0.0;
	var max : float = 1.0;
		
	override function Draw ( x : float, y : float ) {	
		if ( sliderType == SliderType.Horizontal ) {
			sliderValue = GUI.HorizontalSlider ( Rect ( x, y, transform.localScale.x, transform.localScale.y ), sliderValue, min, max );
		} else {
			sliderValue = GUI.VerticalSlider ( Rect ( x, y, transform.localScale.x, transform.localScale.y ), sliderValue, max, min );
		}
	}
}