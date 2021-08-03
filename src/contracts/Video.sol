pragma solidity 0.5.16;

import "./ERC721Full.sol";

contract Video is ERC721Full {
  uint public videoCount = 0;

  struct VideoInfo {
        string videoHash;
        address payable owner;
        string donateValue;
    }

  VideoInfo[] public video_list;
  mapping(string => bool) _videoExists;

  constructor() ERC721Full("Video", "VIDEO") public {
  }

  function mint(string memory _video) public {
    require(!_videoExists[_video]);
    videoCount++;
    VideoInfo memory temp  = VideoInfo(_video, msg.sender, "0.03");
    video_list.push(temp);
    _mint(msg.sender, videoCount);
    _videoExists[_video] = true;
  }

}
