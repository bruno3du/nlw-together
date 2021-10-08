/** @format */

import copyImg from '../assets/images/copy.svg';
import '../styles/room-code.scss'


type RoomCodeProps = {
  code: string;
}

export default function RoomCode(props: RoomCodeProps) {

  function copyRoomCodetoClipboard() {
    navigator.clipboard.writeText(props.code)
  }
	return (
		<button className='room-code' onClick={copyRoomCodetoClipboard}>
			<div>
				<img src={copyImg} alt='Copy room code' />
			</div>
			<span>Sala {props.code}</span>
		</button>
	);
}
