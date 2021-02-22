import React, { useContext, useMemo, useState } from 'react';
import { Form, Modal, Radio, Select, Slider, Button, notification } from 'antd';
import { alpha2ToAlpha3B, getNames } from '@cospired/i18n-iso-languages';
import { OptionsCtx, SubType } from '../../../features/options';
import { EmbyCtx } from '../../../features/emby/embyCtx';
import { Emby } from '../../../features/emby/emby';

interface Props {
    visible?: boolean
    onClose?: () => void
}

const marks = {
    192000: '144p',
    400000: '360p',
    1000001: '720p',
    4000002: '1080p',
    40000001: '4K'
};

function getQuality(bitrate: number):string {
    const mapping = Object.entries(marks);
    for (let i = 0; mapping[i] && mapping[i + 1]; i++) {
        if (bitrate >= parseInt(mapping[i][0], 10) && bitrate < parseInt(mapping[i + 1][0], 10)) {
            return mapping[i][1];
        }
    }
    return Object.values(marks).pop() || '';
}

function prettyPrintBitrate(bitrate: number):string {
    if (bitrate < 1000) {
        return `${bitrate.toString()} bps`;
    } else if (bitrate < 1000 * 1000) {
        return `${(bitrate / 1000).toFixed(0)} kbps`;
    } else {
        return `${(bitrate / (1000 * 1000)).toFixed(0)} mbps`;
    }
}

export function Options({ visible = true, onClose }: Props) {
    const countryList = useMemo(() => getNames("en"), []);
    const [form] = Form.useForm();
    const { options } = useContext(OptionsCtx);
    const { authenticator } = useContext(EmbyCtx);
    const [subType, setSubType] = useState<SubType>(options.getOpt().defaultSubType);
    const [isAutoDetectingBitrate, setAutoDetectBitrate] = useState<boolean>(false);

    const autoDetectBitrate = () => {
        setAutoDetectBitrate(true);
        let emby: Emby;
        try {
            emby = authenticator.getEmby();
        } catch (e) {
            setAutoDetectBitrate(false);
            return notification.error({
                message: 'Could not auto detect bitrate',
                description: 'You are not connected on a Emby server (Join a room and a server before)'
            });
        }
        (async () => {
            const bitrate = await emby.bitrateTest();
            setAutoDetectBitrate(false);
            const values = form.getFieldsValue();
            values.maxBitrate = Math.round(bitrate * 0.9);
            form.setFieldsValue(values);
        })();
    };

    return (
        <Modal
            title="Options"
            visible={visible}
            onCancel={() => {
                if (onClose) {
                    onClose();
                }
            }}
            onOk={() => {
                options.setOpt(form.getFieldsValue() as any);
                if (onClose) {
                    onClose();
                }
            }}
        >
            <Form
                form={form}
                initialValues={options.getOpt()}
            >
                <Form.Item
                    label="Default audio language"
                    name="defaultAudioLanguage"
                >
                    <Select showSearch>
                        {
                            Object.entries(countryList).map(([k, v]) => {
                                const alpha3b = alpha2ToAlpha3B(k);
                                if (!alpha3b) {
                                    return null;
                                }
                                return <Select.Option key={k} value={alpha3b}>{v}</Select.Option>;
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Default subtitle mode"
                    name="defaultSubType"
                >
                    <Radio.Group value={subType} onChange={sub => setSubType(sub.target.value)}>
                        <Radio value={SubType.NONE}>None</Radio>
                        <Radio value={SubType.FORCED}>Forced</Radio>
                        <Radio value={SubType.COMPLETE}>Complete</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    label="Default subtitle language"
                    name="defaultSubLanguage"
                >
                    <Select showSearch disabled={subType === SubType.NONE}>
                        {
                            Object.entries(countryList).map(([k, v]) => {
                                const alpha3b = alpha2ToAlpha3B(k);
                                if (!alpha3b) {
                                    return null;
                                }
                                return <Select.Option key={k} value={alpha3b}>{v}</Select.Option>;
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Maximum bitrate"
                    name="maxBitrate"
                >
                    <Slider
                        min={192*1000}
                        max={60*1000*1000}
                        tipFormatter={value => (`${getQuality(value || 0)} - ${prettyPrintBitrate(value || 0)}`)}
                    />
                </Form.Item>
                <Button onClick={autoDetectBitrate} loading={isAutoDetectingBitrate}>
                    Auto detect bitrate
                </Button>
            </Form>
        </Modal>
    );
}
