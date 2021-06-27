import { Layout, Content, Aside } from '~components/layout'
import { observer } from 'mobx-react'
import classnames from 'classnames'
import { useRoomContext, useGlobalContext } from 'agora-edu-core'
import {NavigationBar} from '~capabilities/containers/nav'
import {ScreenSharePlayerContainer} from '~capabilities/containers/screen-share-player'
import {WhiteboardContainer} from '~capabilities/containers/board'
import {DialogContainer, Exit} from '~capabilities/containers/dialog'
import {LoadingContainer} from '~capabilities/containers/loading'
import {VideoMarqueeStudentContainer, VideoPlayerTeacher} from '~capabilities/containers/video-player'
import {HandsUpContainer} from '~capabilities/containers/hands-up'
import {RoomChat} from '@/ui-kit/capabilities/containers/room-chat'
import './style.css'
import { useEffectOnce } from '@/infra/hooks/utils'
import { Tabs, TabPane } from '~components/tabs';
import { EndClass } from '~ui-kit'
import { EduRoleTypeEnum } from 'agora-rte-sdk'
import { useMemo } from 'react'

export const MidClassScenario = observer(() => {

  const {joinRoom} = useRoomContext()
  const {
    roomInfo,
    liveClassStatus,
  } = useRoomContext()
  const {
    isFullScreen,
  } = useGlobalContext()

  useEffectOnce(() => {
    joinRoom()
  })

  const cls = classnames({
    'edu-room': 1,
    'fullscreen': !!isFullScreen
  })
  const userType = useMemo(() => {
    if (roomInfo.userRole === EduRoleTypeEnum.teacher) {
      return 'teacher'
    }
    return 'student'
  }, [roomInfo.userRole])
  const {
    addDialog,
  } = useGlobalContext()
  const handleExit = () => {
    addDialog(Exit)
  }

  return (
    <Layout
      className={cls}
      direction="col"
      style={{
        height: '100vh'
      }}
    >
      <NavigationBar />
      { userType == 'student' && liveClassStatus.classState == 'end-class' &&
        <EndClass className="end-class-position" onExit={handleExit}/>
      }
      <Layout className="bg-white" style={{ height: '100%' }}>
        <Aside>
          <VideoPlayerTeacher />
          <VideoMarqueeStudentContainer />
        </Aside>
        <Content className="column">
          <div className="board-box">
            <ScreenSharePlayerContainer />
            <WhiteboardContainer />
          </div>
          <div className="pin-right">
            <HandsUpContainer/>
          </div>
          <div className="pin-left">
            <RoomChat />
          </div>
          <DialogContainer />
          <LoadingContainer />
        </Content>
      </Layout>
    </Layout>
  )
})