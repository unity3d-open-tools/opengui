#pragma strict

import System.Collections.Generic;
import System.Linq;

@script ExecuteInEditMode();
class OGLine {
	public var start : OGWidget;
	public var startDir : Vector3;
	public var end : OGWidget;
	public var endDir : Vector3;
	public var segments : int;

	function OGLine ( start : OGWidget, startDir : Vector3, end : OGWidget, endDir : Vector3, segments : int ) {
		this.start = start;
		this.startDir = startDir;
		this.end = end;
		this.endDir = endDir;
		this.segments = segments;
	}
}

class OGRoot extends MonoBehaviour {
	public static var instance : OGRoot;

	public var targetResolution : Vector2;
	public var skin : OGSkin;
	public var currentPage : OGPage;
	public var lineMaterial : Material;
	public var downWidget : OGWidget;	
	public var isMouseOver : boolean = false;

	private var widgets : OGWidget[];
	private var mouseOver : List.< OGWidget > = new List.< OGWidget > ();
	private var screenRect : Rect;
	private var guiTex : Texture2D;


	//////////////////
	// Instance
	//////////////////
	public static function GetInstance () {
		return instance;
	}


	public function get ratio () : Vector2 {
		var result : Vector2 = Vector2.one;
		
		result.x = Screen.width / screenWidth;
		result.y = Screen.height / screenHeight;

		return result;
	}
	
	public function get reverseRatio () : Vector2 {
		var result : Vector2 = Vector2.one;
		
		result.x = screenWidth / Screen.width;
		result.y = screenHeight / Screen.height;

		return result;
	}
	
	public function get screenWidth () : float {
		if ( targetResolution.x > 0 ) {
			return targetResolution.x;
		
		} else if ( targetResolution.y > 0 ) {
			var ratio : float = targetResolution.y / Screen.height;
			
			return Screen.width * ratio;

		} else {
			return Screen.width;

		}
	}
	
	public function get screenHeight () : float {
		if ( targetResolution.y > 0 ) {
			return targetResolution.y;
		
		} else if ( targetResolution.x > 0 ) {
			var ratio : float = targetResolution.x / Screen.width;
			
			return Screen.height * ratio;

		} else {
			return Screen.height;

		}
	}


	//////////////////
	// Page management
	//////////////////
	public function SetCurrentPage ( page : OGPage ) {
		currentPage = page;

		for ( var p : OGPage in this.GetComponentsInChildren.<OGPage>(true) ) {
			p.gameObject.SetActive ( p == currentPage );
		}
	}
	
	public function GoToPage ( pageName : String ) {
		if ( currentPage != null ) {
			currentPage.ExitPage ();
			
			currentPage.gameObject.SetActive ( false );
		}
		
		for ( var p : OGPage in this.GetComponentsInChildren.<OGPage>(true) ) {
			if ( p.pageName == pageName ) {
				currentPage = p;
			}
		}
		
		if ( currentPage != null ) {
			currentPage.gameObject.SetActive ( true );
		
			currentPage.StartPage ();
			currentPage.UpdateStyles ();
		}
	}

	
	//////////////////
	// Draw loop
	//////////////////
	public function OnPostRender () {
		if ( skin != null && widgets != null ) {
			var i : int = 0;
			var o : int = 0;
			var w : OGWidget;
			
			GL.PushMatrix();
			GL.LoadPixelMatrix ( 0, screenWidth, 0, screenHeight );

			// Draw skin
			GL.Begin(GL.QUADS);
			OGDrawHelper.SetPass(skin.atlas);
			
			for ( i = 0; i < widgets.Length; i++ ) {
				w = widgets[i];
				
				if ( w == null ) {
					continue;
				
				} else if ( w.drawRct == null || ( w.drawRct.x == 0 && w.drawRct.y == 0 && w.drawRct.height == 0 && w.drawRct.width == 0 ) ) {
					w.Recalculate ();
					continue;
				}
				
				if ( w.currentStyle == null ) {
					w.currentStyle = w.styles.basic;
				}
				
				if ( w.gameObject.activeSelf && w.isDrawn && w.drawRct.height > 0 && w.drawRct.width > 0 ) {
					w.DrawSkin ();
				}
			}
			
			GL.End ();
			
			// Draw text
			for ( i = 0; i < skin.fonts.Length; i++ ) {
				if ( skin.fonts[0] == null ) { continue; }
				
				GL.Begin(GL.QUADS);
				
				if ( skin.fontShader != null && skin.fonts[i].bitmapFont != null ) {
					skin.fonts[i].bitmapFont.material.shader = skin.fontShader;
				}
				
				if ( skin.fonts[i].bitmapFont != null ) {
					OGDrawHelper.SetPass ( skin.fonts[i].bitmapFont.material );
				}

				for ( o = 0; o < widgets.Length; o++ ) {
					w = widgets[o];
				
					if ( w == null ) { continue; }

					if ( w.styles == null ) {
						skin.ApplyDefaultStyles ( w );

					} else if ( w.isDrawn && w.gameObject.activeSelf ) {
						if ( w.currentStyle != null && w.currentStyle.text.fontIndex == i ) {
							if ( w.currentStyle.text.font == null ) {
								w.currentStyle.text.font = skin.fonts[i];
							}
							
							w.DrawText ();
						}
					}
				}
				
				GL.End ();
			}
			
			// Draw lines
			if ( lineMaterial != null ) {
				GL.Begin(GL.LINES);
				lineMaterial.SetPass(0);
					
				for ( i = 0; i < widgets.Length; i++ ) {	
					w = widgets[i];
					
					if ( w != null && w.gameObject.activeSelf && w.isDrawn ) {
						w.DrawLine();
					}
				}
				
				GL.End();
			}
			
			// Draw textures
			for ( i = 0; i < widgets.Length; i++ ) {	
				w = widgets[i];
				
				if ( w != null && w.gameObject.activeSelf && w.isDrawn ) {
					w.DrawGL();
				}
			}


			GL.PopMatrix();
		}
	}
	
	
	//////////////////
	// Init
	//////////////////
	public function Awake () {
		instance = this;
	}
	
	public function Start () {
		if ( currentPage != null && Application.isPlaying ) {
			currentPage.StartPage ();
		}
	}


	//////////////////
	// Update
	//////////////////
	public function ReleaseWidget () {
		downWidget = null;
	}

	public function Update () {
		if ( instance == null ) {
			instance = this;
		}

		this.transform.localScale = Vector3.one;
		this.transform.localPosition = Vector3.zero;
		this.transform.localEulerAngles = Vector3.zero;

		// Only update these when playing
		if ( Application.isPlaying && currentPage != null ) {
			// Current page
			currentPage.UpdatePage ();

			// Update styles if in edit mode
			if ( !Application.isPlaying ) {
				currentPage.UpdateStyles ();
			}

			// Mouse interaction
			UpdateMouse ();	
		}

		// Dirty
		UpdateWidgets ();
		
		// Force OGPage transformation
		if ( currentPage ) {
			currentPage.transform.localScale = Vector3.one;
			currentPage.transform.localPosition = Vector3.zero;
			currentPage.transform.localEulerAngles = Vector3.zero;
		}
	}


	//////////////////
	// Mouse interaction
	//////////////////
	private function GetDragging () : Vector2 {
		var dragging : Vector2;
		
		if ( Input.GetMouseButton ( 0 ) || Input.GetMouseButton ( 2 ) ) {
			dragging.x = Input.GetAxis ( "Mouse X" );
			dragging.y = Input.GetAxis ( "Mouse Y" );
		
		} else if ( GetTouch () == TouchPhase.Moved ) {
			var t = Input.GetTouch ( 0 );
			var pos = GUIUtility.ScreenToGUIPoint ( t.position );
			dragging = t.deltaPosition * ( Time.deltaTime / t.deltaTime );
		}

		return dragging;
	}
	
	private function GetTouch () : TouchPhase {
		if ( Input.touchCount < 1 ) {
			return -1;
		
		} else {
			var touch : Touch = Input.GetTouch ( 0 );

			return touch.phase;
		}
	}
	
	public function UpdateMouse () {
		if ( widgets == null ) { return; }
		
		var i : int = 0;
		var w : OGWidget;

		// Click
		if ( Input.GetMouseButtonDown ( 0 ) || Input.GetMouseButtonDown ( 2 ) || GetTouch () == TouchPhase.Began ) {
			var topWidget : OGWidget;
			
			for ( i = 0; i < mouseOver.Count; i++ ) {
				w = mouseOver[i];
				
				if ( ( w.GetType() != typeof ( OGScrollView ) || ( w as OGScrollView ).touchControl ) && ( topWidget == null || w.transform.position.z < topWidget.transform.position.z ) && w.isSelectable ) {
					topWidget = w;
				}
			}
			
			if ( downWidget && downWidget != topWidget ) {
				downWidget.OnMouseCancel ();
			}
			
			if ( topWidget != null && topWidget.CheckMouseOver() && !topWidget.isDisabled ) {
				topWidget.OnMouseDown ();
				downWidget = topWidget;
			}

		// Release
		} else if ( Input.GetMouseButtonUp ( 0 ) || Input.GetMouseButtonUp ( 2 ) || GetTouch () == TouchPhase.Ended || GetTouch () == TouchPhase.Canceled ) {
			if ( downWidget ) {
				// Draggable
				if ( downWidget.resetAfterDrag && downWidget.GetType() != typeof ( OGScrollView ) ) {
					downWidget.transform.position = downWidget.dragOrigPos;
					downWidget.dragOffset = Vector3.zero;
					downWidget.dragOrigPos = Vector3.zero;
				}
				
				// Mouse over
				if ( ( downWidget.CheckMouseOver() || GetTouch () == TouchPhase.Ended ) && !downWidget.isDisabled && downWidget.CheckMouseOver()) {
					downWidget.OnMouseUp ();

				// Mouse out
				} else {
					downWidget.OnMouseCancel ();
				
				}
			
			}
		
		// Dragging
		} else if ( GetDragging () != Vector2.zero ) {
			if ( downWidget != null && !downWidget.isDisabled ) {
				if ( downWidget.clipTo && downWidget.clipTo.GetType() == typeof ( OGScrollView ) && ( downWidget.clipTo as OGScrollView ).touchControl ) {
					var thisWidget : OGWidget = downWidget;
					thisWidget.OnMouseCancel ();
					downWidget = thisWidget.clipTo;
				}
				
				downWidget.OnMouseDrag ();
			
				if ( downWidget.isDraggable && downWidget.GetType() != typeof ( OGScrollView ) ) {
					var mousePos : Vector3 = Input.mousePosition;
					mousePos.y = screenHeight - mousePos.y;

					if ( downWidget.dragOffset == Vector3.zero ) {
						if ( downWidget.resetAfterDrag ) {
							downWidget.dragOrigPos = downWidget.transform.position;
						}

						downWidget.dragOffset = downWidget.transform.position - mousePos;
					}

					var newPos : Vector3 = downWidget.transform.position;
					newPos = mousePos + downWidget.dragOffset;
					downWidget.transform.position = newPos;
				}
			}
		}

		// Escape key
		if ( Input.GetKeyDown ( KeyCode.Escape ) ) {
			if ( downWidget != null ) {
				downWidget.OnMouseCancel ();
				ReleaseWidget ();
			}
		}
	}	

	// OnGUI selection
	#if UNITY_EDITOR
	
	public static var EditorSelectWidget : Function;

	private function FindMouseOverWidget ( e : Event ) : OGWidget {
		var pos : Vector2 = new Vector2 ( e.mousePosition.x * reverseRatio.x, screenHeight - e.mousePosition.y * reverseRatio.y );

		for ( var i : int = widgets.Length - 1; i >= 0; i-- ) {
			if ( widgets[i].drawRct.Contains ( pos ) ) {
				return widgets[i];
			}
		}

		return null;
	}

	private function MoveSelection ( x : float, y : float ) {
		for ( var i : int = 0; i < Selection.gameObjects.Length; i++ ) {
			var w : OGWidget = Selection.gameObjects[i].GetComponent.<OGWidget>();

			if ( w ) {
				var newPos : Vector3 = new Vector3 ( x, y, 0 );

				w.transform.localPosition = w.transform.localPosition + newPos;
			}
		}
	}

	public function OnGUI () {
		var e : Event = Event.current;

		if ( !Application.isPlaying ) {
			var color : Color = Color.white;
			
			if ( !guiTex ) {		
				guiTex = new Texture2D ( 1, 1 );
				guiTex.SetPixel ( 0, 0, color );
				guiTex.Apply ();
			}

			var style : GUIStyle = new GUIStyle();
			style.normal.background = guiTex;
					
			for ( var i : int = 0; i < Selection.gameObjects.Length; i++ ) {
				var w : OGWidget = Selection.gameObjects[i].GetComponent.<OGWidget>();

				if ( w ) {
					var revRect : Rect = w.scaledRct;
					revRect.y = Screen.height - revRect.y - revRect.height;

					var pivotRect : Rect = new Rect ( w.transform.position.x - 2, w.transform.position.y - 2, 4, 4 );
					
					pivotRect.x *= ratio.x;
					pivotRect.width *= ratio.x;
					pivotRect.y *= ratio.y;
					pivotRect.height *= ratio.y;
				
					Handles.color = color;

					// Draw outline
					Handles.DrawPolyLine (
						new Vector3 ( revRect.xMin, revRect.yMin, 0 ),
						new Vector3 ( revRect.xMin, revRect.yMax, 0 ),
						new Vector3 ( revRect.xMax, revRect.yMax, 0 ),
						new Vector3 ( revRect.xMax, revRect.yMin, 0 ),
						new Vector3 ( revRect.xMin, revRect.yMin, 0 )
					);

					// Draw pivot
					GUI.Box ( pivotRect, "", style );
					
				}
			}

			switch ( e.type ) { 
				case EventType.MouseDown:
					w = FindMouseOverWidget ( e );

					EditorSelectWidget ( w, e.shift );
					
					break;

				case EventType.KeyDown:
					var modifier : int = 1;

					if ( e.shift ) {
						modifier = 10;
					}

					switch ( e.keyCode ) {
						case KeyCode.UpArrow:
							MoveSelection ( 0, -modifier );
							break;
						
						case KeyCode.DownArrow:
							MoveSelection ( 0, modifier );
							break;
						
						case KeyCode.LeftArrow:
							MoveSelection ( -modifier, 0 );
							break;
						
						case KeyCode.RightArrow:
							MoveSelection ( modifier, 0 );
							break;
					}

					break;
			}
		}
	}
	#endif


	//////////////////
	// Widget management
	//////////////////
	public function UpdateWidgets () {
		screenRect = new Rect ( 0, screenWidth, 0, screenHeight );

		if ( currentPage == null ) { return; }
		
		mouseOver.Clear ();
		
		// Update widget lists	
		widgets = currentPage.gameObject.GetComponentsInChildren.<OGWidget>().OrderByDescending(function(w:OGWidget) w.transform.position.z).ToArray();

		for ( var i : int = 0; i < widgets.Length; i++ ) {
			var w : OGWidget = widgets[i];

			if ( w == null || !w.isDrawn ) { continue; }

			// Check mouse
			if ( w.CheckMouseOver() ) 
			{
				w.OnMouseOver ();
				mouseOver.Add ( w );
			}
			
			// Check scroll offset
			if ( !w.clipTo ) {
				w.scrollOffset.x = 0;
				w.scrollOffset.y = 0;
			}

			w.root = this;
			w.UpdateWidget ();
			w.Recalculate ();

			// Cleanup from previous OpenGUI versions
			if ( w.hidden ) {
				DestroyImmediate ( w.gameObject );
			}
		}
		
		// Is mouse over anything?
		isMouseOver = mouseOver.Count > 0;
	}
}
