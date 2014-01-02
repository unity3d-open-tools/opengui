#pragma strict

public class OGSlider extends OGWidget {
	public var sliderValue : float = 0;
	public var sliderLabel : OGLabel;
	public var toPercent : boolean = true;
	public var suffix : String = "";

	private var background : OGSprite;
	private var thumb : OGSlicedSprite;
	

	////////////////
	// Mouse
	////////////////
	override function OnMouseDrag () {
		if ( sliderValue >= 0 && sliderValue <= 1 ) {
			sliderValue = ( Input.mousePosition.x - 10 - this.transform.position.x ) / this.transform.lossyScale.x;
		}
	

		sliderValue = Mathf.Clamp ( Mathf.Round ( sliderValue * 100 ) / 100, 0, 1 );

		thumb.transform.localPosition = new Vector3 ( sliderValue, 0.5, 0 );
		
		if ( sliderLabel ) {
			if ( toPercent ) {
				sliderLabel.text = ( sliderValue * 100 ).ToString() + suffix;
			} else {
				sliderLabel.text = sliderValue.ToString() + suffix;
			}	
		}

		SetDirty ();
	}

	override function OnMouseCancel () {
		GetRoot().ReleaseWidget();
	}
	
	override function OnMouseUp () {
		GetRoot().ReleaseWidget();
	}
	

	////////////////
	// Set drawn
	////////////////
	override function SetDrawn ( drawn : boolean ) {
		isDrawn = drawn;
		
		background.isDrawn = isDrawn;
		thumb.isDrawn = isDrawn;
	}
	

	////////////////
	// Build
	////////////////
	override function Build () {
		isSelectable = true;
	
		// Background		
		if ( background == null ) {
			if ( this.gameObject.GetComponentInChildren ( OGSprite ) ) {
				background = this.gameObject.GetComponentInChildren ( OGSprite );
			} else {			
				var newSprite : OGSprite = new GameObject ( "Sprite", OGSprite ).GetComponent ( OGSprite );
				newSprite.transform.parent = this.transform;
				background = newSprite;
			}
		}

		background.transform.localScale = new Vector3 ( 1, 0.25, 1 );
		background.transform.localEulerAngles = Vector3.zero;
		background.transform.localPosition = new Vector3 ( 0, 0.5, 1 );
		
		background.pivot.x = RelativeX.Left;
		background.pivot.y = RelativeY.Center;
		
		background.styles.basic = this.styles.basic;
		background.hidden = true;
		
		// Thumb		
		if ( thumb == null ) {
			if ( this.gameObject.GetComponentInChildren ( OGSlicedSprite ) ) {
				thumb = this.gameObject.GetComponentInChildren ( OGSlicedSprite );
			} else {			
				var newThumb : OGSlicedSprite = new GameObject ( "SlicedSprite", OGSlicedSprite ).GetComponent ( OGSlicedSprite );
				newThumb.transform.parent = this.transform;
				thumb = newThumb;
			}
		}

		thumb.transform.localScale = new Vector3 ( this.transform.lossyScale.y / this.transform.lossyScale.x, 1, 1 );
		thumb.transform.localEulerAngles = Vector3.zero;
		thumb.transform.localPosition = new Vector3 ( sliderValue, 0.5, 0 );
		
		thumb.pivot.x = RelativeX.Center;
		thumb.pivot.y = RelativeY.Center;
		thumb.styles.basic = this.styles.thumb;
		thumb.hidden = true;
	}


	////////////////
	// Update
	////////////////	
	override function UpdateWidget () {
		// Null check
		if ( !background || !thumb ) {
			Build ();
			return;
		}

		// Mouse
		mouseRct = CombineRects ( thumb.drawRct, background.drawRct );
		
		// Update data
		thumb.transform.localPosition = new Vector3 ( sliderValue, 0.5, 0 );
		
		// Persistent vars
		this.pivot.x = RelativeX.Left;
		this.pivot.y = RelativeY.Center;
	}
}
