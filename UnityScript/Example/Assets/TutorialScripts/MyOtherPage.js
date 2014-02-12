#pragma strict

public class MyOtherPage extends OGPage {
	public function SwitchPage () {
		OGRoot.GetInstance().GoToPage ( "MyPage" );
	}
}
