export function ok(res, data = {}, meta) {
  return res.json({
    success: true,
    data,
    ...(meta && { meta })
  });
}

export function created(res, data = {}, meta) {
  return res.status(201).json({
    success: true,
    data,
    ...(meta && { meta })
  });
}
