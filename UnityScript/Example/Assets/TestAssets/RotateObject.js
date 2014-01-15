#pragma strict

public class RotateObject extends MonoBehaviour {
	function Update () {
		transform.eulerAngles.y = transform.eulerAngles.y + Time.deltaTime * 10;
	}
}
