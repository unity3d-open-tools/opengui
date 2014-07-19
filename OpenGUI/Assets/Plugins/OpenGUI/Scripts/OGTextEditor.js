#pragma strict

import System.Reflection;

public class OGTextEditor {
 	public class ClipboardHelper {
		private static var m_systemCopyBufferProperty : PropertyInfo = null;
		
		private static function GetSystemCopyBufferProperty () : PropertyInfo {
			if ( m_systemCopyBufferProperty == null ) {
				var T : System.Type = typeof ( GUIUtility );
				m_systemCopyBufferProperty = T.GetProperty ( "systemCopyBuffer", BindingFlags.Static | BindingFlags.NonPublic );
				
				if ( m_systemCopyBufferProperty == null ) {
					Debug.LogError ( "Can't access internal member 'GUIUtility.systemCopyBuffer' it may have been removed / renamed" );
				}
			}

			return m_systemCopyBufferProperty;
		}

		public static function GetClipboard () : String {
			var P : PropertyInfo = GetSystemCopyBufferProperty ();
			return P.GetValue ( null, null ).ToString ();
		}

		public static function SetClipboard ( value : String ) {
			var P : PropertyInfo = GetSystemCopyBufferProperty ();
			P.SetValue ( null, value, null );
		}
	}

	public var enabled : boolean = false;
	public var string : String;
	public var cursorPos : Vector2;
	public var cursorSelectPos : Vector2;
	public var cursorSize : Vector2 = new Vector2 ( 2, 12 );
	public var cursorRect : Rect;
	public var selectionRects : Rect [] = new Rect[0];
	public var cursorIndex : int;
	public var cursorSelectIndex : int;
	public var delayUntilRepeat : int = 20;
	public var repeat : int = 10;
	public var exitKey : KeyCode = KeyCode.Escape;
	public var exitAction : System.Action;

	private var clipboardHelper : ClipboardHelper;

	private function get shiftPressed () : boolean {
		var e : Event = Event.current;
		return e.shift;
	}

	private function get arrowPressed () : boolean { 
		var e : Event = Event.current;
		return e.isKey && e.keyCode == KeyCode.LeftArrow || e.keyCode == KeyCode.DownArrow || e.keyCode == KeyCode.UpArrow || e.keyCode == KeyCode.RightArrow;
	}

	private function get ctrlOrCmdPressed () : boolean {
		var e : Event = Event.current;
		return e.command || e.control;
	}

	private function get exitKeyPressed () : boolean {
		var e : Event = Event.current;
		return e.isKey && e.keyCode == exitKey;
	}

	public function Backspace () {
		if ( cursorIndex > 0 && string.Length > 0 ) {
			if ( cursorSelectIndex == cursorIndex ) {
				cursorIndex--;
			}
			
			string = string.Remove ( cursorIndex, cursorSelectIndex - cursorIndex );

			cursorSelectIndex = cursorIndex;
		}
	}
	
	public function Delete () {
		if ( cursorIndex < string.Length ) {
			if ( cursorSelectIndex == cursorIndex ) {
				cursorSelectIndex++;
			}
			
			string = string.Remove ( cursorIndex, cursorSelectIndex - cursorIndex );

			cursorSelectIndex = cursorIndex;
		}
	}

	public function InsertText ( newText : String ) {
		var e : Event = Event.current;
		
		if ( e.keyCode == KeyCode.Backspace || e.keyCode == KeyCode.Delete || arrowPressed || String.IsNullOrEmpty ( newText ) ) {
			return;
		}
		
		if ( cursorIndex != cursorSelectIndex ) {
			Backspace ();
		}
		
		if ( cursorIndex < string.Length - 1 ) {
			string.Insert ( cursorIndex, newText );
		
		} else {
			string += newText;

		}

		cursorIndex += newText.Length;
		cursorSelectIndex = cursorIndex;
	}
	
	public function MoveUp () {
		MoveLeft ();
	}
	
	public function MoveDown () {
		MoveRight ();
	}
	
	public function MoveLeft () {
		if ( cursorIndex > 0 ) {
			if ( !shiftPressed ) {
				if ( cursorIndex != cursorSelectIndex ) {
					cursorSelectIndex = cursorIndex;
				
				} else {
					cursorIndex--;
					cursorSelectIndex = cursorIndex;
				}

			} else {
				cursorIndex--;

			}
		}
	}

	public function MoveRight () {
		if ( cursorIndex < string.Length ) {
			if ( !shiftPressed ) {
				if ( cursorIndex != cursorSelectIndex ) {
					cursorIndex = cursorSelectIndex;
				
				} else {
					cursorIndex++;
					cursorSelectIndex = cursorIndex;
				}

			} else {
				cursorSelectIndex++;

			}
		}
	}

	public function Update ( text : String, rect : Rect ) : String {
		var e : Event = Event.current;

		string = text;
		
		if ( e.type == EventType.KeyDown ) {
			if ( e.keyCode == KeyCode.Backspace ) {
				Backspace ();
			
			} else if ( Input.GetKeyDown ( KeyCode.Delete ) ) {
				Delete ();
			
			// Select all
			} else if ( ctrlOrCmdPressed && e.keyCode == KeyCode.A ) {
				cursorIndex = 0;
				cursorSelectIndex = string.Length;

			// Paste
			} else if ( ctrlOrCmdPressed && e.keyCode == KeyCode.V ) {
				InsertText ( ClipboardHelper.GetClipboard () );

			// Copy
			} else if ( ctrlOrCmdPressed && e.keyCode == KeyCode.C ) {
				var copyString : String = string.Substring ( cursorIndex, cursorSelectIndex - cursorIndex );

				if ( !String.IsNullOrEmpty ( copyString ) ) {
					ClipboardHelper.SetClipboard ( copyString );
				}
			
			// Cut	
			} else if ( ctrlOrCmdPressed && e.keyCode == KeyCode.X ) {
				copyString = string.Substring ( cursorIndex, cursorSelectIndex - cursorIndex );

				if ( !String.IsNullOrEmpty ( copyString ) ) {
					ClipboardHelper.SetClipboard ( copyString );
					Backspace ();
				}

			} else if ( e.keyCode == KeyCode.LeftArrow ) {
				MoveLeft ();
			
			} else if ( e.keyCode == KeyCode.UpArrow ) {
				MoveUp ();
			
			} else if ( e.keyCode == KeyCode.DownArrow ) {
				MoveDown ();
			
			} else if ( e.keyCode == KeyCode.RightArrow ) {
				MoveRight ();
				
			} else if ( !ctrlOrCmdPressed ) {
				InsertText ( e.character + "" );
				
			}
		}

		if ( cursorIndex != cursorSelectIndex ) {
			cursorRect = new Rect ( 0, 0, 0, 0 );
			
			var lines : int = ( cursorSelectPos.y - cursorPos.y ) / cursorSize.y;

			lines++;

			selectionRects = new Rect[lines];

			for ( var i : int = 0; i < lines; i++ ) {
				if ( i < 1 ) {
					if ( lines > 1 ) {
						selectionRects[i] = new Rect ( cursorPos.x, cursorPos.y, rect.xMax - cursorPos.x, cursorSize.y );
					
					} else {
						selectionRects[i] = new Rect ( cursorPos.x, cursorPos.y, cursorSelectPos.x - cursorPos.x, cursorSize.y );

					}

				} else if ( i == lines ) {
					selectionRects[i] = new Rect ( rect.x, cursorPos.y + ( i * cursorSize.y ), cursorSelectPos.x - rect.x, cursorSize.y );

				} else {
					selectionRects[i] = new Rect ( rect.x, cursorPos.y + ( i * cursorSize.y ), rect.width, cursorSize.y );

				}
			}
			
		} else {
			cursorRect = new Rect ( cursorPos.x, cursorPos.y, cursorSize.x, cursorSize.y );
			selectionRects = new Rect[0];

		}


		return string;
	}
}

