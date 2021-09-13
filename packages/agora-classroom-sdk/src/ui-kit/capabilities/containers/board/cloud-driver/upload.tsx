import {
  CheckBox,
  Col,
  IconBox,
  Inline,
  Placeholder,
  Row,
  t,
  Table,
  TableHeader,
  transI18n,
  SvgImg,
} from '~ui-kit';
import dayjs from 'dayjs';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useCallback } from 'react';
import { useCloudDriveContext } from 'aa-agora-edu-core-lb';
import { useUIStore } from '@/infra/hooks';

export interface UploadContainerProps {
  handleUpdateCheckedItems: (ids: string[]) => void;
}

export const UploadContainer: React.FC<UploadContainerProps> = observer(
  ({ handleUpdateCheckedItems }) => {
    const { openCloudResource, personalResources, startDownload } = useCloudDriveContext();

    const { updateChecked } = useUIStore();

    const [checkMap, setCheckMap] = React.useState<Record<string, any>>({}); // TODO：多选的值类型建议用数组结构，待优化

    React.useEffect(() => {
      handleUpdateCheckedItems(Object.keys(checkMap).filter((it) => !!checkMap[it]));
    }, [checkMap, handleUpdateCheckedItems]);

    /**
     * 列表长度变化时，需要同步check的状态（删除的时候）
     */
    React.useEffect(() => {
      const oldCheckMap = { ...checkMap };
      for (let key of Object.keys(checkMap)) {
        if (personalResources.findIndex((it) => it.id === key) === -1) {
          delete oldCheckMap[key];
        }
      }
      setCheckMap(oldCheckMap);
    }, [personalResources.length]);

    const items = React.useMemo(() => {
      return personalResources.map((it: any) => ({
        ...it,
        checked: !!checkMap[it.id],
      }));
    }, [personalResources.length, JSON.stringify(checkMap)]);

    const hasSelected: any = React.useMemo(() => {
      return !!items.find((item: any) => !!item.checked);
    }, [items, checkMap]);

    React.useEffect(() => {
      updateChecked(hasSelected);
    }, [hasSelected, updateChecked]);

    const isSelectAll: any = React.useMemo(() => {
      const selected = items.filter((item: any) => !!item.checked);
      return items.length > 0 && selected.length === items.length ? true : false;
    }, [items, checkMap]);

    const handleSelectAll = useCallback(
      (evt: any) => {
        // TODO: skip empty
        if (!items.length) {
          return;
        }
        if (isSelectAll) {
          const ids = items
            .map((item: any) => ({ [`${item.id}`]: 0 }))
            .reduce((acc: any, it: any) => ({ ...acc, ...it }));
          const v = {
            ...checkMap,
            ...ids,
          };
          setCheckMap(v);
        } else {
          const ids = items
            .map((item: any) => ({ [`${item.id}`]: 1 }))
            .reduce((acc: any, it: any) => ({ ...acc, ...it }));
          const v = {
            ...checkMap,
            ...ids,
          };
          setCheckMap(v);
        }
      },
      [items, isSelectAll, checkMap],
    );

    const changeChecked = useCallback(
      (id: any, checked: boolean) => {
        // TODO: skip empty
        if (!items.length) {
          return;
        }
        const idx = items.findIndex((item: any) => item.id === id);
        if (idx >= 0) {
          setCheckMap({
            ...checkMap,
            ...{ [`${id}`]: +checked },
          });
        }
      },
      [items, checkMap],
    );

    const onResourceClick = async (resourceUuid: string, taskUuid: string) => {
      await openCloudResource(resourceUuid);
      await startDownload(taskUuid);
    };

    return (
      <Table>
        <TableHeader>
          <Col width={9}>
            <CheckBox
              checked={isSelectAll}
              indeterminate={isSelectAll ? false : hasSelected}
              onClick={handleSelectAll}></CheckBox>
          </Col>
          <Col>{transI18n('cloud.fileName')}</Col>
          <Col>{transI18n('cloud.size')}</Col>
          <Col>{transI18n('cloud.updated_at')}</Col>
        </TableHeader>
        <Table className="table-container upload-table-container">
          {items.length ? (
            items.map(
              ({ id, name, size, updateTime, type, checked, taskUuid }: any, idx: number) => (
                <Row height={10} border={1} key={idx}>
                  <Col style={{ paddingLeft: 19 }} width={9}>
                    <CheckBox
                      className="checkbox"
                      onClick={(evt: any) => {
                        changeChecked(id, evt.currentTarget.checked);
                      }}
                      checked={checked}></CheckBox>
                  </Col>
                  <Col
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      onResourceClick(id, taskUuid);
                    }}>
                    <SvgImg type={type} style={{ marginRight: '6px' }} />
                    <Inline className="filename" color="#191919" title={name}>
                      {name}
                    </Inline>
                  </Col>
                  <Col>
                    <Inline color="#586376">{size}</Inline>
                  </Col>
                  <Col>
                    <Inline color="#586376">
                      {dayjs(updateTime).format('YYYY-MM-DD HH:mm:ss')}
                    </Inline>
                  </Col>
                </Row>
              ),
            )
          ) : (
            <Placeholder placeholderType="noFile" />
          )}
        </Table>
      </Table>
    );
  },
);
