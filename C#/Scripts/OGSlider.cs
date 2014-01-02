using UnityEngine;
using System.Collections;

[AddComponentMenu ("OpenGUI/Slider")]
public class OGSlider : OGWidget {

	public enum SliderType {
		Horizontal,
		Vertical
	}

	public SliderType sliderType;
	public float sliderValue = 1.0f;
	public float min = 0.0f;
	public float max = 1.0f;
		
	public override void Draw (  float x ,   float y   ){	
		if ( sliderType == SliderType.Horizontal ) {
			sliderValue = GUI.HorizontalSlider ( new Rect( x, y, transform.localScale.x, transform.localScale.y ), sliderValue, min, max );
		} else {
			sliderValue = GUI.VerticalSlider ( new Rect( x, y, transform.localScale.x, transform.localScale.y ), sliderValue, max, min );
		}
	}
}
