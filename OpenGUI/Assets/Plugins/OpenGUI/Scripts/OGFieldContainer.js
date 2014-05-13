#pragma strict

public class OGFieldContainer extends MonoBehaviour {
	private class Field {
		@HideInInspector public var enabled : boolean = true;
		@HideInInspector public var setCounter : int = 0;
		@HideInInspector public var scale : Vector2 = new Vector2 ( 140, 16 );

		public function get canSet () : boolean {
			if ( setCounter > 0 ) {
				setCounter--;
			}
			
			return setCounter == 0;
		}

		public function set canSet ( value : boolean ) {
			setCounter = value ? 2 : -1;
		}
		
		public function Update ( text : String, pos : Vector2, scale : Vector2 ) {}

		public function Destroy () {}

		public static function New ( type : System.Type, transform : Transform ) : Field {
			if ( type == typeof ( FToggle ) ) {
				return new FToggle ( transform );
			
			} else if ( type == typeof ( FFloatField ) ) {
				return new FFloatField ( transform );
			
			} else if ( type == typeof ( FTextField ) ) {
				return new FTextField ( transform );
			
			} else if ( type == typeof ( FColorField ) ) {
				return new FColorField ( transform );
			
			} else if ( type == typeof ( FSlider ) ) {
				return new FSlider ( transform );
			
			} else if ( type == typeof ( FButton ) ) {
				return new FButton ( transform );
			
			} else if ( type == typeof ( FVector3Field ) ) {
				return new FVector3Field ( transform );
			
			} else if ( type == typeof ( FPopup ) ) {
				return new FPopup ( transform );
			
			}

			return null;	
		}
	}

	private class FVector3Field extends Field {
		public var x : OGTextField;
		public var y : OGTextField;
		public var z : OGTextField;
		public var title : OGLabel;

		function FVector3Field ( parent : Transform ) {
			x = new GameObject ( "fld_X" ).AddComponent.< OGTextField > ();
			y = new GameObject ( "fld_Y" ).AddComponent.< OGTextField > ();
			z = new GameObject ( "fld_Z" ).AddComponent.< OGTextField > ();
			title = new GameObject ( "lbl_Vector3" ).AddComponent.< OGLabel > ();

			x.transform.parent = parent;
			y.transform.parent = parent;
			z.transform.parent = parent;
			title.transform.parent = parent;
			
			x.ApplyDefaultStyles ();
			y.ApplyDefaultStyles ();
			z.ApplyDefaultStyles ();
			title.ApplyDefaultStyles ();
		}

		override function Destroy () {
			MonoBehaviour.Destroy ( x.gameObject );
			MonoBehaviour.Destroy ( y.gameObject );
			MonoBehaviour.Destroy ( z.gameObject );
			MonoBehaviour.Destroy ( title.gameObject );
		}

		override function Update ( text : String, pos : Vector2, scale : Vector2 ) {
			title.text = text;
			title.tint.a = enabled ? 1.0 : 0.5;
			
			x.tint.a = enabled ? 1.0 : 0.5;
			x.isDisabled = !enabled;
			
			y.tint.a = enabled ? 1.0 : 0.5;
			y.isDisabled = !enabled;
			
			z.tint.a = enabled ? 1.0 : 0.5;
			z.isDisabled = !enabled;

			if ( !String.IsNullOrEmpty ( text ) ) {
				title.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
				title.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
				
				x.transform.localPosition = new Vector3 ( pos.x + scale.x / 2, pos.y, 0 );
				x.transform.localScale = new Vector3 ( scale.x / 6, scale.y, 1 );

				y.transform.localPosition = new Vector3 ( pos.x + scale.x / 2 + scale.x / 6, pos.y, 0 );
				y.transform.localScale = new Vector3 ( scale.x / 6, scale.y, 1 );
				
				z.transform.localPosition = new Vector3 ( pos.x + scale.x / 2 + ( ( scale.x / 6 ) * 2 ), pos.y, 0 );
				z.transform.localScale = new Vector3 ( scale.x / 6, scale.y, 1 );

			} else {
				x.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
				x.transform.localScale = new Vector3 ( scale.x / 3, scale.y, 1 );

				y.transform.localPosition = new Vector3 ( pos.x + scale.x / 3, pos.y, 0 );
				y.transform.localScale = new Vector3 ( scale.x / 3, scale.y, 1 );
				
				z.transform.localPosition = new Vector3 ( pos.x + ( ( scale.x / 3 ) * 2 ), pos.y, 0 );
				z.transform.localScale = new Vector3 ( scale.x / 3, scale.y, 1 );

			}
		}

		public function get listening () : boolean {
			return x.listening || y.listening || z.listening;
		}

		public function Set ( v : Vector3 ) : Vector3 {
			if ( !listening ) {
				x.text = ( Mathf.Round ( v.x * 1000 ) / 1000 ).ToString();
				y.text = ( Mathf.Round ( v.y * 1000 ) / 1000 ).ToString();
				z.text = ( Mathf.Round ( v.z * 1000 ) / 1000 ).ToString();
			}

			return Out();
		}

		public function Out () : Vector3 {
			var nx : float;
			var ny : float; 
			var nz : float;
			
			x.text = x.text.Replace ( "\n", "" );
			y.text = y.text.Replace ( "\n", "" );
			z.text = z.text.Replace ( "\n", "" );

			float.TryParse ( x.text, nx );
			float.TryParse ( y.text, ny );
			float.TryParse ( z.text, nz );

			return new Vector3 ( nx, ny, nz );
		}
	}

	private class FColorField extends Field {
		public var r : OGTextField;
		public var g : OGTextField;
		public var b : OGTextField;
		public var a : OGTextField;
		public var title : OGLabel;

		public function get listening () : boolean {
			return r.listening || g.listening || b.listening || a.listening;
		}

		public function Set ( c : Color ) : Color {
			if ( !listening ) {
				r.text = ( Mathf.Round ( c.r * 1000 ) / 1000 ).ToString();
				g.text = ( Mathf.Round ( c.g * 1000 ) / 1000 ).ToString();
				b.text = ( Mathf.Round ( c.b * 1000 ) / 1000 ).ToString();
				a.text = ( Mathf.Round ( c.a * 1000 ) / 1000 ).ToString();
			}

			return Out ();
		}

		function FColorField ( parent : Transform ) {
			r = new GameObject ( "fld_R" ).AddComponent.< OGTextField > ();
			g = new GameObject ( "fld_G" ).AddComponent.< OGTextField > ();
			b = new GameObject ( "fld_B" ).AddComponent.< OGTextField > ();
			a = new GameObject ( "fld_A" ).AddComponent.< OGTextField > ();
			title = new GameObject ( "lbl_Vector3" ).AddComponent.< OGLabel > ();

			r.transform.parent = parent;
			g.transform.parent = parent;
			b.transform.parent = parent;
			a.transform.parent = parent;
			title.transform.parent = parent;
			
			r.ApplyDefaultStyles ();
			g.ApplyDefaultStyles ();
			b.ApplyDefaultStyles ();
			a.ApplyDefaultStyles ();
			title.ApplyDefaultStyles ();
		}

		override function Destroy () {
			MonoBehaviour.Destroy ( r.gameObject );
			MonoBehaviour.Destroy ( g.gameObject );
			MonoBehaviour.Destroy ( b.gameObject );
			MonoBehaviour.Destroy ( a.gameObject );
			MonoBehaviour.Destroy ( title.gameObject );
		}

		override function Update ( text : String, pos : Vector2, scale : Vector2 ) {
			title.text = text;
			title.tint.a = enabled ? 1.0 : 0.5;
			
			r.tint.a = enabled ? 1.0 : 0.5;
			r.isDisabled = !enabled;
			
			g.tint.a = enabled ? 1.0 : 0.5;
			g.isDisabled = !enabled;
			
			b.tint.a = enabled ? 1.0 : 0.5;
			b.isDisabled = !enabled;

			a.tint.a = enabled ? 1.0 : 0.5;
			a.isDisabled = !enabled;

			if ( !String.IsNullOrEmpty ( text ) ) {
				title.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
				title.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
				
				r.transform.localPosition = new Vector3 ( pos.x + scale.x / 2, pos.y, 0 );
				r.transform.localScale = new Vector3 ( scale.x / 8, scale.y, 1 );

				g.transform.localPosition = new Vector3 ( pos.x + scale.x / 2 + scale.x / 8, pos.y, 0 );
				g.transform.localScale = new Vector3 ( scale.x / 8, scale.y, 1 );
				
				b.transform.localPosition = new Vector3 ( pos.x + scale.x / 2 + ( ( scale.x / 8 ) * 2 ), pos.y, 0 );
				b.transform.localScale = new Vector3 ( scale.x / 8, scale.y, 1 );
				
				a.transform.localPosition = new Vector3 ( pos.x + scale.x / 2 + ( ( scale.x / 8 ) * 3 ), pos.y, 0 );
				a.transform.localScale = new Vector3 ( scale.x / 8, scale.y, 1 );

			} else {
				r.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
				r.transform.localScale = new Vector3 ( scale.x / 4, scale.y, 1 );

				g.transform.localPosition = new Vector3 ( pos.x + scale.x / 4, pos.y, 0 );
				g.transform.localScale = new Vector3 ( scale.x / 4, scale.y, 1 );
				
				b.transform.localPosition = new Vector3 ( pos.x + ( ( scale.x / 4 ) * 2 ), pos.y, 0 );
				b.transform.localScale = new Vector3 ( scale.x / 4, scale.y, 1 );
				
				a.transform.localPosition = new Vector3 ( pos.x + ( ( scale.x / 4 ) * 3 ), pos.y, 0 );
				a.transform.localScale = new Vector3 ( scale.x / 4, scale.y, 1 );

			}
		}

		public function Out () : Color {
			var nr : float;
			var ng : float; 
			var nb : float;
			var na : float;
			
			r.text = r.text.Replace ( "\n", "" );
			g.text = g.text.Replace ( "\n", "" );
			b.text = b.text.Replace ( "\n", "" );
			a.text = a.text.Replace ( "\n", "" );

			float.TryParse ( r.text, nr );
			float.TryParse ( g.text, ng );
			float.TryParse ( b.text, nb );
			float.TryParse ( a.text, na );

			return new Color ( nr, ng, nb, na );
		}
	}

	private class FButton extends Field {
		public var button : OGButton;

		private var clicked : boolean = false;

		function FButton ( parent : Transform ) {
			button = new GameObject ( "btn_Button" ).AddComponent.< OGButton > ();
			button.transform.parent = parent;
			button.ApplyDefaultStyles ();
		}
		
		override function Destroy () {
			MonoBehaviour.Destroy ( button.gameObject );
		}
		
		override function Update ( text : String, pos : Vector2, scale : Vector2 ) {
			button.text = text;
			button.tint.a = enabled ? 1.0 : 0.5;
			button.isDisabled = !enabled;

			button.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
			button.transform.localScale = new Vector3 ( scale.x, scale.y, 1 );
		}

		public function Set () : boolean {
			button.func = function () {
				if ( enabled ) {
					clicked = true;
				}
			};

			var wasClicked : boolean = clicked;
			clicked = false;

			return wasClicked;
		}
	}
	
	private class FLabelField extends Field {
		public var label : OGLabel;

		public function Set ( text : String ) {
			label.text = text;
		}
	}

	private class FPopup extends Field {
		public var popup : OGPopUp;
		public var title : OGLabel;

		function FPopup ( parent : Transform ) {
			popup = new GameObject ( "pop_Popup" ).AddComponent.< OGPopUp > ();
			title = new GameObject ( "lbl_Popup" ).AddComponent.< OGLabel > ();

			popup.transform.parent = parent;
			title.transform.parent = parent;
			
			popup.ApplyDefaultStyles ();
			title.ApplyDefaultStyles ();
		}

		override function Destroy () {
			MonoBehaviour.Destroy ( popup.gameObject );
			MonoBehaviour.Destroy ( title.gameObject );
		}

		override function Update ( text : String, pos : Vector2, scale : Vector2 ) {
			title.text = text;
			
			if ( !String.IsNullOrEmpty ( text ) ) {
				popup.title = "< " + text.ToLower() + " >";
			
			} else {
				popup.title = "...";
			
			}

			title.tint.a = enabled ? 1.0 : 0.5;
			popup.tint.a = enabled ? 1.0 : 0.5;
			popup.isDisabled = !enabled;

			if ( !String.IsNullOrEmpty ( text ) ) {
				title.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
				title.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
				popup.transform.localPosition = new Vector3 ( pos.x + scale.x / 2, pos.y, popup.isUp ? -1 : 0 );
				popup.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
			
			} else {
				popup.transform.localPosition = new Vector3 ( pos.x, pos.y, popup.isUp ? -1 : 0 );
				popup.transform.localScale = new Vector3 ( scale.x, scale.y, 1 );
			
			}
		}
		
		public function Set ( selected : int, strings : String [] ) : int {
			if ( canSet ) {
				popup.options = strings;
				if ( strings.Length > 0 ) {
					popup.selectedOption = strings[selected];
				} else {
					popup.selectedOption = "";
				}
			}
			
			setCounter = popup.isUp ? -1 : 0;

			return Out ();
		}

		public function Out () : int {
			for ( var i : int = 0; i < popup.options.Length; i++ ) {
				if ( popup.selectedOption == popup.options[i] ) {
					return i;
				}
			}
			
			return 0;
		}	
	}

	private class FToggle extends Field {
		public var tickbox : OGTickBox;

		function FToggle ( parent : Transform ) {
			tickbox = new GameObject ( "tbx_Toggle" ).AddComponent.< OGTickBox > ();
			
			tickbox.transform.parent = parent;
				
			tickbox.ApplyDefaultStyles ();
		}

		override function Destroy () {
			MonoBehaviour.Destroy ( tickbox.gameObject );
		}

		override function Update ( text : String, pos : Vector2, scale : Vector2 ) {
			tickbox.tint.a = enabled ? 1.0 : 0.5;
			tickbox.isDisabled = !enabled;
			
			tickbox.text = text;
			tickbox.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
			tickbox.transform.localScale = new Vector3 ( scale.x, scale.y, 1 );
		}

		public function Set ( isTicked : boolean ) : boolean {
			if ( canSet ) {
				tickbox.isTicked = isTicked;
				canSet = true;
			}

			return Out ();
		}

		public function Out () : boolean {
			return tickbox.isTicked;
		}
	}

	private class FSlider extends Field {
		public var slider : OGSlider;
		public var title : OGLabel;

		private var min : float;
		private var max : float;
		
		private function CalcValue ( value : float ) : float {
			return ( ( max - min ) * value ) + min;
		}

		private function CalcValuePercent ( value : float ) : float {
			return ( value - min ) / ( max - min );
		}

		function FSlider ( parent : Transform ) {
			slider = new GameObject ( "sld_Slider" ).AddComponent.< OGSlider > ();
			title = new GameObject ( "lbl_Slider" ).AddComponent.< OGLabel > ();

			slider.transform.parent = parent;
			title.transform.parent = parent;
			
			slider.ApplyDefaultStyles ();
			title.ApplyDefaultStyles ();
		}

		override function Destroy () {
			MonoBehaviour.Destroy ( slider.gameObject );
			MonoBehaviour.Destroy ( title.gameObject );
		}

		override function Update ( text : String, pos : Vector2, scale : Vector2 ) {
			title.text = text;
			
			title.tint.a = enabled ? 1.0 : 0.5;
			slider.tint.a = enabled ? 1.0 : 0.5;
			slider.isDisabled = !enabled;

			if ( !String.IsNullOrEmpty ( text ) ) {
				title.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
				title.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
				slider.transform.localPosition = new Vector3 ( pos.x + scale.x / 2, pos.y, 0 );
				slider.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
			
			} else {
				slider.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
				slider.transform.localScale = new Vector3 ( scale.x, scale.y, 1 );
			
			}
		}

		public function Set ( value : float, min : float, max : float ) : float {
			if ( canSet ) {
				this.min = min;
				this.max = max;

				slider.sliderValue = CalcValuePercent ( value );
			}

			setCounter = slider.CheckMouseOver () ? -1 : 0;

			return Out ();
		}

		public function Out () : float {
			return CalcValue ( slider.sliderValue );
		}	
	}

	private class FFloatField extends Field {
		public var textfield : OGTextField;
		public var title : OGLabel;

		function FFloatField ( parent : Transform ) {
			textfield = new GameObject ( "fld_Float" ).AddComponent.< OGTextField > ();
			title = new GameObject ( "lbl_Float" ).AddComponent.< OGLabel > ();

			textfield.transform.parent = parent;
			title.transform.parent = parent;
			
			textfield.ApplyDefaultStyles ();
			title.ApplyDefaultStyles ();
		}

		override function Destroy () {
			MonoBehaviour.Destroy ( textfield.gameObject );
			MonoBehaviour.Destroy ( title.gameObject );
		}

		override function Update ( text : String, pos : Vector2, scale : Vector2 ) {
			title.text = text;
			
			title.tint.a = enabled ? 1.0 : 0.5;
			textfield.tint.a = enabled ? 1.0 : 0.5;
			textfield.isDisabled = !enabled;

			if ( !String.IsNullOrEmpty ( text ) ) {
				title.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
				title.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
				textfield.transform.localPosition = new Vector3 ( pos.x + scale.x / 2, pos.y, 0 );
				textfield.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
			
			} else {
				textfield.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
				textfield.transform.localScale = new Vector3 ( scale.x, scale.y, 1 );
			
			}
		}

		public function Set ( value : float ) : float {
			if ( !textfield.listening ) {
				textfield.text = value.ToString ();
			}

			return Out ();
		}

		public function Out () : float {
			var value : float;

			textfield.text = textfield.text.Replace ( "\n", "" );
			
			float.TryParse ( textfield.text, value );
			
			return value;
		}	
	}

	private class FIntField extends Field {
		public var textfield : OGTextField;
		public var title : OGLabel;

		function FIntField ( parent : Transform ) {
			textfield = new GameObject ( "fld_Int" ).AddComponent.< OGTextField > ();
			title = new GameObject ( "lbl_Int" ).AddComponent.< OGLabel > ();

			textfield.transform.parent = parent;
			title.transform.parent = parent;
			
			textfield.ApplyDefaultStyles ();
			title.ApplyDefaultStyles ();
		}

		override function Destroy () {
			MonoBehaviour.Destroy ( textfield.gameObject );
			MonoBehaviour.Destroy ( title.gameObject );
		}

		override function Update ( text : String, pos : Vector2, scale : Vector2 ) {
			title.text = text;
			
			title.tint.a = enabled ? 1.0 : 0.5;
			textfield.tint.a = enabled ? 1.0 : 0.5;
			textfield.isDisabled = !enabled;

			if ( !String.IsNullOrEmpty ( text ) ) {
				title.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
				title.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
				textfield.transform.localPosition = new Vector3 ( pos.x + scale.x / 2, pos.y, 0 );
				textfield.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
			
			} else {
				textfield.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
				textfield.transform.localScale = new Vector3 ( scale.x, scale.y, 1 );
			
			}
		}

		public function Set ( value : int ) : int {
			if ( !textfield.listening ) {	
				textfield.text = value.ToString ();
			}

			return Out ();
		}

		public function Out () : int {
			var value : int;
			
			textfield.text = textfield.text.Replace ( "\n", "" );

			int.TryParse ( textfield.text, value );
			
			return value;
		}	
	}

	private class FTextField extends Field {
		public var textfield : OGTextField;
		public var title : OGLabel;

		function FTextField ( parent : Transform ) {
			textfield = new GameObject ( "fld_Text" ).AddComponent.< OGTextField > ();
			title = new GameObject ( "lbl_Text" ).AddComponent.< OGLabel > ();

			textfield.transform.parent = parent;
			title.transform.parent = parent;
			
			textfield.ApplyDefaultStyles ();
			title.ApplyDefaultStyles ();
		}

		override function Destroy () {
			MonoBehaviour.Destroy ( textfield.gameObject );
			MonoBehaviour.Destroy ( title.gameObject );
		}

		override function Update ( text : String, pos : Vector2, scale : Vector2 ) {
			title.text = text;
			
			title.tint.a = enabled ? 1.0 : 0.5;
			textfield.tint.a = enabled ? 1.0 : 0.5;
			textfield.isDisabled = !enabled;

			if ( !String.IsNullOrEmpty ( text ) ) {
				title.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
				title.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
				textfield.transform.localPosition = new Vector3 ( pos.x + scale.x / 2, pos.y, 0 );
				textfield.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
			
			} else {
				textfield.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
				textfield.transform.localScale = new Vector3 ( scale.x, scale.y, 1 );
			
			}
		}


		public function Set ( string : String ) : String {
			if ( !textfield.listening ) {
				textfield.text = string;
			}
			
			return Out ();
		}

		public function Out () : String {
			textfield.text = textfield.text.Replace ( "\n", "" );
			
			return textfield.text;
		}	
	}
	
	public var width : float = 280;
	@HideInInspector public var offset : Vector2;

	private var fields : Field[] = new Field[900];
	private var fieldCounter : int = 0;
	private var disabled : boolean = false;

	public function Fields () {}

	// Clean up
	public function CleanUp () {
		for ( var i : int = fieldCounter; i < fields.Length; i++ ) {
			if ( fields[i] ) {
				fields[i].Destroy ();
				fields[i] = null;
			}
		}
	}

	public function Clear () {
		offset = Vector2.zero;
		fields = new Field[900];
		fieldCounter = 0;
	}

	// Disable fields
	public function BeginDisabled ( b : boolean ) {
		disabled = b;
	}

	public function EndDisabled () {
		disabled = false;
	}

	private function CheckField ( type : System.Type ) : Field {
		if ( fields [ fieldCounter ] ) {
			if ( fields [ fieldCounter ].GetType() != type ) {
				fields [ fieldCounter ].Destroy ();
				fields [ fieldCounter ] = Field.New ( type, this.transform );
			}
		
		} else {
			fields [ fieldCounter ] = Field.New ( type, this.transform );

		}
		
		return fields [ fieldCounter ];
	}

	// Space
	public function Offset ( x : float, y : float ) {
		offset.x += x;
		offset.y += y;
	}

	// Vector3Field
	public function Vector3Field ( text : String, input : Vector3 ) : Vector3 {
		offset.y += 20;
		return Vector3Field ( text, input, new Rect ( offset.x, offset.y, width - offset.x, 16 ) );
	}

	public function Vector3Field ( text : String, input : Vector3, rect : Rect ) : Vector3 {
		var vector3Field : FVector3Field = CheckField ( typeof ( FVector3Field ) ) as FVector3Field;
		vector3Field.Update ( text, new Vector2 ( rect.x, rect.y ), new Vector2 ( rect.width, rect.height ) );
		vector3Field.enabled = !disabled;
		fieldCounter++;
		return vector3Field.Set ( input );
	}
	
	// ColorField
	public function ColorField ( text : String, input : Color ) : Color {
		offset.y += 20;
		return ColorField ( text, input, new Rect ( offset.x, offset.y, width - offset.x, 16 ) );
	}

	public function ColorField ( text : String, input : Color, rect : Rect ) : Color {
		var colorField : FColorField = CheckField ( typeof ( FColorField ) ) as FColorField;
		colorField.Update ( text, new Vector2 ( rect.x, rect.y ), new Vector2 ( rect.width, rect.height ) );
		colorField.enabled = !disabled;
		fieldCounter++;
		return colorField.Set ( input );
	}
	
	// Slider
	public function Slider ( text : String, input : float, min : float, max : float ) : float {
		offset.y += 20;
		return Slider ( text, input, min, max, new Rect ( offset.x, offset.y, width - offset.x, 16 ) );
	}

	public function Slider ( text : String, input : float, min : float, max : float, rect : Rect ) : float {
		var slider : FSlider = CheckField ( typeof ( FSlider ) ) as FSlider;
		slider.Update ( text, new Vector2 ( rect.x, rect.y ), new Vector2 ( rect.width, rect.height ) );
		slider.enabled = !disabled;
		fieldCounter++;
		return slider.Set ( input, min, max );
	}

	// TextField
	public function TextField ( text : String, input : String ) : String {
		offset.y += 20;
		return TextField ( text, input, new Rect ( offset.x, offset.y, width - offset.x, 16 ) );
	}

	public function TextField ( text : String, input : String, rect : Rect ) : String {
		var textField : FTextField = CheckField ( typeof ( FTextField ) ) as FTextField;
		textField.Update ( text, new Vector2 ( rect.x, rect.y ), new Vector2 ( rect.width, rect.height ) );
		textField.enabled = !disabled;
		fieldCounter++;
		return textField.Set ( input );
	}

	// FloatField
	public function FloatField ( text : String, input : float ) : float {
		offset.y += 20;
		return FloatField ( text, input, new Rect ( offset.x, offset.y, width - offset.x, 16 ) );
	}

	public function FloatField ( text : String, input : float, rect : Rect ) : float {
		var floatField : FFloatField = CheckField ( typeof ( FFloatField ) ) as FFloatField;
		floatField.Update ( text, new Vector2 ( rect.x, rect.y ), new Vector2 ( rect.width, rect.height ) );
		floatField.enabled = !disabled;
		fieldCounter++;
		return floatField.Set ( input );
	}

	// Button
	public function Button ( text : String ) : boolean {
		offset.y += 20;
		return Button ( text, new Rect ( offset.x, offset.y, width - offset.x, 16 ) );
	}

	public function Button ( text : String, rect : Rect ) : boolean {
		var button : FButton = CheckField ( typeof ( FButton ) ) as FButton;
		button.Update ( text, new Vector2 ( rect.x, rect.y ), new Vector2 ( rect.width, rect.height ) );
		button.enabled = !disabled;
		fieldCounter++;
		return button.Set ();
	}

	// Popup
	public function Popup ( text : String, input : int, strings : String[] ) : int {
		offset.y += 20;
		return Popup ( text, input, strings, new Rect ( offset.x, offset.y, width - offset.x, 16 ) );
	}
	
	public function Popup ( text : String, input : int, strings : String[], rect : Rect ) : int {
		var popup : FPopup = CheckField ( typeof ( FPopup ) ) as FPopup;
		popup.Update ( text, new Vector2 ( rect.x, rect.y ), new Vector2 ( rect.width, rect.height ) );
		popup.enabled = !disabled;
		fieldCounter++;
		return popup.Set ( input, strings );
	}

	// Toggle
	public function Toggle ( text : String, input : boolean ) : boolean {
		offset.y += 20;
		return Toggle ( text, input, new Rect ( offset.x, offset.y, width - offset.x, 16 ) );
	}
	
	public function Toggle ( text : String, input : boolean, rect : Rect ) : boolean {
		var toggle : FToggle = CheckField ( typeof ( FToggle ) ) as FToggle;
		toggle.Update ( text, new Vector2 ( rect.x, rect.y ), new Vector2 ( rect.width, rect.height ) );
		toggle.enabled = !disabled;
		fieldCounter++;
		return toggle.Set ( input );
	}

	public function Update () {
		fieldCounter = 0;
		offset = new Vector2 ( 0, -20 );

		Fields ();

		CleanUp ();
	}
}
