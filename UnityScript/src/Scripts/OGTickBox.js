#pragma strict

public class OGTickBox extends OGWidget {
	public var text : String;
	public var isTicked : boolean;
	
	// TODO: Deprecate
	@HideInInspector public var isChecked : boolean;
	
	private var background : OGSlicedSprite;
	private var label : OGLabel;
	
	override function OnMouseOver () {
		label.styles.basic = styles.hover;
	}
	
	override function OnMouseCancel () {
		label.styles.basic = styles.basic;
	}
	
	override function OnMouseDown () {
		isTicked = !isTicked;
		
		OGRoot.GetInstance().ReleaseWidget ();
		SetDirty ();
	}

	////////////////
	// Set drawn
	////////////////	
	override function SetDrawn ( drawn : boolean ) {
		isDrawn = drawn;

		background.isDrawn = isDrawn;
		label.isDrawn = isDrawn;
	}

	
	////////////////
	// Build
	////////////////	
	override function Build () {
		isSelectable = true;

		// Background		
		if ( background == null ) {
			if ( this.gameObject.GetComponentInChildren ( OGSlicedSprite ) ) {
				background = this.gameObject.GetComponentInChildren ( OGSlicedSprite );
				
			} else {			
				var newSprite : OGSlicedSprite = new GameObject ( "SlicedSprite", OGSlicedSprite ).GetComponent ( OGSlicedSprite );
				newSprite.transform.parent = this.transform;
				background = newSprite;
			}
		}

		background.transform.localScale = new Vector3 ( this.transform.lossyScale.y / this.transform.lossyScale.x, 1, 1 );
		background.transform.localEulerAngles = Vector3.zero;
		background.transform.localPosition = new Vector3 ( 1 - this.transform.lossyScale.y / this.transform.lossyScale.x, 0, 0 );
	
		background.isDrawn = isDrawn;
		background.hidden = true;
		
		// Label
		if ( label == null ) {
			if ( this.gameObject.GetComponentInChildren ( OGLabel ) ) {
				label = this.gameObject.GetComponentInChildren ( OGLabel );
				
			} else {				
				var newLabel : OGLabel = new GameObject ( "Label", OGLabel ).GetComponent ( OGLabel );
				newLabel.transform.parent = this.transform;
				label = newLabel;
			}
		}

		label.text = text;
		label.transform.localScale = Vector3.one;
		label.transform.localEulerAngles = Vector3.zero;
		label.transform.localPosition = Vector3.zero;
		
		label.styles.basic = this.styles.basic;
		
		label.isDrawn = isDrawn;
		label.hidden = true;
	}

	
	////////////////
	// Update
	////////////////	
	override function UpdateWidget () {
		// Null check
		if ( !background || !label ) {
			Build ();
			return;
		}
		
		// TODO: Deprecate
		isChecked = isTicked;

		// Mouse	
		mouseRct = background.drawRct;
		
		// Update data
		label.text = text;
		
		if ( isTicked ) {
			background.styles.basic = styles.ticked;
		} else {
			background.styles.basic = styles.basic;
		}
	
	}
}
